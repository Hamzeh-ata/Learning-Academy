using Arkan.Server.BaseRepository;
using Arkan.Server.ClientMessagesModels;
using Arkan.Server.Data;
using Arkan.Server.Enums;
using Arkan.Server.ImagesHelper;
using Arkan.Server.Messages_Interfaces;
using Arkan.Server.Models;
using Arkan.Server.Notifications;
using Arkan.Server.SupportChat_PageModels;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace Arkan.Server.Messages_Services
{
    public class SupportChatRepository: ISupportChat
    {
        private readonly IBaseRepository _IBaseRepository;
        private readonly ApplicationDBContext _context;
        private readonly ImageHelperInterface _ImageHelper;
        private readonly UserManager<ApplicationUser> _userManager;
        IHubContext<NotificationHub> _hubContext;
        private readonly INotificationService _NotificationService;
        public SupportChatRepository(
            IBaseRepository IBaseRepository
            , ApplicationDBContext context
            , ImageHelperInterface ImageHelper
            , UserManager<ApplicationUser> userManager
            , IHubContext<NotificationHub> hubContext
            , INotificationService NotificationService )
        {
            _IBaseRepository = IBaseRepository;
             _context = context;
             _ImageHelper = ImageHelper;
             _userManager = userManager;
             _hubContext = hubContext;
            _NotificationService = NotificationService;
        }
        public async Task<int> StartNewChat(string? userId)
        {
            var newRoom = new SupportChatRoom
            {
                ClientSideUserId = userId ?? null,
                StartDate = _IBaseRepository.GetJordanTime()
            };

            await _IBaseRepository.AddAsync<SupportChatRoom>(newRoom);

            return newRoom.Id;
          }
        public async Task<GetSupportMessage> SendMessage(string? userId, SendSupportMessage model)
        {

            int? chatRoomId = 0;

            if (model.ChatRoomId == 0 || model.ChatRoomId == null)
            {
                chatRoomId = await StartNewChat(userId);
            }
            else
            {
                chatRoomId = model.ChatRoomId;
            }

            string userRole = Roles.Visitor.ToString();

            if (!string.IsNullOrEmpty(userId))
            {
                var userRoles = await _context.UsersRoles
                .Where(ur => ur.UserId == userId)
                .Select(ur => ur.Role.Name)
                .ToListAsync();

                if (userRoles.Contains(Roles.Admin.ToString()))
                {
                    userRole = Roles.Admin.ToString();
                }
                else if (userRoles.Contains(Roles.Instructor.ToString())){

                    userRole = Roles.Instructor.ToString();
                }
                else
                {
                    userRole = Roles.Student.ToString();

                }
            }

            var message = new SupportChatMessage
            {
                Content = model.Content,
                SupportChatRoomId = chatRoomId,
                SenderUserId = userId ?? null,
                Role = userRole,
                Timestamp = _IBaseRepository.GetJordanTime(),
            };

            if (model.File != null)
            {

                if (!model.File.ContentType.StartsWith("image/"))
                {
                    return new GetSupportMessage
                    {
                        Key = ResponseKeys.UnsupportedType.ToString()
                    };
                }

                message.FilePath = await _ImageHelper.AddChatFile(model.File);
            }

            var senderUser = await _userManager.FindByIdAsync(userId);

            await _IBaseRepository.AddAsync<SupportChatMessage>(message);

            var addedMessage = new GetSupportRoomMessages
            {
                MessageId = message.Id,
                Content = message.Content,
                SenderId = message.SenderUserId,
                SenderImage = senderUser.ProfileImage,
                SenderName = senderUser.FirstName + " " + senderUser.LastName,
                Timestamp = message.Timestamp,
                File = message.FilePath,
                RoomId = message.SupportChatRoomId,
                SentByClient = userRole != Roles.Admin.ToString(),
                isOnline = true,
            };

            var clientSideUserId = await _context.SupportChatRoom
            .Where(scr => scr.Id == message.SupportChatRoomId)
            .Select(scr => scr.ClientSideUserId)
            .FirstOrDefaultAsync();

            if (message.Role == Roles.Admin.ToString()) {

                await _NotificationService.Notify(NotifyTopics.client.ToString(), $"New message from Khaled", clientSideUserId);
            }
            else
            {
                 await _NotificationService.NotifyAdmin(NotifyTopics.admin.ToString(), $"New Message Received From {senderUser.FirstName}", AdminNotifications.Messages);
          
            }
            await _hubContext.Clients.Group(message.SupportChatRoomId.ToString()).SendAsync("ReceiveSupportMessage", addedMessage);

            var addedMessage1 = new GetSupportMessage
            {
                Id = message.Id,
                Content = message.Content,
                SenderId = message.SenderUserId,
                SenderProfileImage = senderUser.ProfileImage,
                SenderName = senderUser.FirstName + " " + senderUser.LastName,
                Timestamp = message.Timestamp,
                File = message.FilePath,
                RoomId = message.SupportChatRoomId,
                Key = ResponseKeys.Success.ToString()
            };

            return addedMessage1;
        }
        public async Task<string> DeleteRoomChat(string userId,int roomId)
        {
            var user = await _userManager.FindByIdAsync(userId);

            if (user is null)
            {
                return ResponseKeys.UserNotFound.ToString();
            }

            var room = await _context.SupportChatRoom
              .Where(ccr => ccr.Id == roomId)
              .FirstOrDefaultAsync();

            if (room == null)
            {
                return ResponseKeys.RoomNotFound.ToString();
            }

            _IBaseRepository.Remove<SupportChatRoom>(room);

            return ResponseKeys.Success.ToString();
        }
        public async Task<List<GetSupportRoomMessages>> GetRoomMessages(string? userId, int roomId)
        {
            var roomExists = await _IBaseRepository.AnyByIdAsync<SupportChatRoom>(roomId);

            if (!roomExists)
            {
                return new List<GetSupportRoomMessages>();
            }

            var messages = await _context.SupportChatMessage
            .Where(m => m.SupportChatRoomId == roomId )
            .Include(m => m.SupportChatRoom)
            .OrderBy(m => m.Timestamp)
            .ToListAsync();

            var distinctSenderIds = messages.Select(m => m.SenderUserId).Distinct();

            var userProfiles = new Dictionary<string, (string Name, string Image)>();

            if (distinctSenderIds.Any())
            {

             foreach (var senderId in distinctSenderIds)
             {
              if (senderId is null)
              {
                  continue;
              }
                 var user = await _userManager.FindByIdAsync(senderId);

                 userProfiles.Add(senderId, (user?.FirstName + " " + user?.LastName, user?.ProfileImage));
             }
            }

            var clientId = messages.FirstOrDefault()?.SupportChatRoom.ClientSideUserId;

            var clientRoomMessages = messages.Select(m => new GetSupportRoomMessages
            {
                RoomId = roomId,
                MessageId = m.Id,
                SenderId = m.SenderUserId ?? Roles.Visitor.ToString(),
                SenderName = m.SenderUserId != null && userProfiles.TryGetValue(m.SenderUserId, out var userProfile) ? userProfile.Name : Roles.Visitor.ToString(),
                SenderImage = m.SenderUserId != null && userProfiles.TryGetValue(m.SenderUserId, out var userImage) ? userImage.Image : Roles.Visitor.ToString(),
                Content = m.Content,
                File = m.FilePath,
                Timestamp = m.Timestamp,
                SentByClient = m.SenderUserId == clientId,
            }).ToList();

            if(userId is not null)
            {
                await MarkAsSeen(userId, roomId);
            }

            return clientRoomMessages;
        }
        public async Task<List<ClientChatSummary>> GetSupportChatSummaries(string userId)
        {
            var userRoles = await _context.UsersRoles
                .Where(ur => ur.UserId == userId)
                .Select(ur => ur.Role.Name)
                .ToListAsync();

            List<SupportChatRoom> rooms;

            if (userRoles.Contains(Roles.Admin.ToString()))
            {
                rooms = await _context.SupportChatRoom
                    .OrderByDescending(scr => scr.StartDate)
                    .ToListAsync();
            }
            else
            {
                rooms = await _context.SupportChatRoom
                    .Where(scr => scr.ClientSideUserId == userId)
                    .OrderByDescending(scr => scr.StartDate)
                    .ToListAsync();
            }

            var activeUsers = await _context.Sessions
               .Where(s => s.Status == SessionStatus.Active)
               .Select(s => s.UserId)
               .ToListAsync();

            var clientSideUsers = rooms.SelectMany(room => new[] { room.ClientSideUserId }).Distinct().ToList();
           
            var clientSideInfo = await _context.Users
                .Where(u => clientSideUsers.Contains(u.Id))
                .Select(u => new { u.Id, FullName = u.FirstName + " " + u.LastName, u.ProfileImage })
                .ToListAsync();

            var summaries = new List<ClientChatSummary>();

            foreach (var room in rooms)
            {
                var lastMessage = await _context.SupportChatMessage
                    .Where(scm => scm.SupportChatRoomId == room.Id)
                    .OrderByDescending(scm => scm.Timestamp)
                    .FirstOrDefaultAsync();

                if (lastMessage != null)
                {
                    string lastMessageUserName = null;
                    string lastMessageUserImage = null;

                    if (lastMessage.SenderUserId != null)
                    {
                        (lastMessageUserName, lastMessageUserImage) = await GetUsersNamesAndImages(lastMessage.SenderUserId);
                    }
                    var clientSender = clientSideInfo.FirstOrDefault(u => u.Id == room.ClientSideUserId);

                    summaries.Add(new ClientChatSummary
                    {
                        RoomId = room.Id,
                        SenderId = clientSender.Id,
                        SenderName = clientSender.FullName,
                        SenderImage = clientSender.ProfileImage,
                        LastMessageUserName = lastMessageUserName?? Roles.Visitor.ToString(),
                        LastMessageUserImage = lastMessageUserImage ?? Roles.Visitor.ToString(),
                        LastMessage = lastMessage.Content,
                        LastMessageTimestamp = lastMessage.Timestamp,
                        IsLastMessageSeen = _context.UserSeenMessages
                         .Any(usm => usm.UserId == userId && usm.RoomId == room.Id && usm.Type == ChatTypes.Support &&
                          usm.LastMessageId == lastMessage.Id) ? true : false,
                        IsOnline = activeUsers.Contains(clientSender.Id),
                    });
                }
            }

            return summaries.OrderByDescending(e => e.LastMessageTimestamp).ToList();
        }
        public async Task<int> GetCurrentUserChatRoom(string userId)
        {
            var userRole = await _IBaseRepository.FindUserRole(userId);

            if (userRole == Roles.Instructor.ToString() || userRole== Roles.Student.ToString())
            {
                return await _context.SupportChatRoom
                .Where(scr => scr.ClientSideUserId == userId)
                .Select(scr => scr.Id)
                .FirstOrDefaultAsync();
            }

            return 0;
         }
        private async Task<(string name, string profileImage)> GetUsersNamesAndImages(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            return (user.FirstName + " " + user.LastName, user.ProfileImage);
        }
        private async Task<string> MarkAsSeen(string userId, int roomId)
        {

            var lastMessageId = await _context.SupportChatMessage
              .Where(crm => crm.SupportChatRoomId == roomId)
              .OrderByDescending(crm => crm.Timestamp)
              .Select(crm => crm.Id)
              .FirstOrDefaultAsync();

            if (lastMessageId == default)
            {
                return ResponseKeys.Success.ToString();
            }

            var UserSeenMessages = new UserSeenMessages
            {
                LastMessageId = lastMessageId,
                RoomId = roomId,
                Type = ChatTypes.Support,
                UserId = userId,
            };

            await _IBaseRepository.AddAsync<UserSeenMessages>(UserSeenMessages);

            return ResponseKeys.Success.ToString();
        }
    }

}
