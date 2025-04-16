using Arkan.Server.BaseRepository;
using Arkan.Server.Data;
using Arkan.Server.Enums;
using Arkan.Server.ImagesHelper;
using Arkan.Server.Messages_Interfaces;
using Arkan.Server.ClientMessagesModels;
using Arkan.Server.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Arkan.Server.Notifications;
using NuGet.Protocol.Plugins;
using Microsoft.IdentityModel.Tokens;
using System.Linq;

namespace Arkan.Server.Messages_Services
{
    public class ClientMessagesRepository : IClientMessages
    {
        private readonly IBaseRepository _IBaseRepository;
        private readonly ApplicationDBContext _context;
        private readonly ImageHelperInterface _ImageHelper;
        private readonly UserManager<ApplicationUser> _userManager;
        IHubContext<NotificationHub> _hubContext;
        private readonly INotificationService _NotificationService;

        public ClientMessagesRepository(IBaseRepository IBaseRepository
            , ApplicationDBContext context
            , ImageHelperInterface ImageHelper
            , UserManager<ApplicationUser> userManager,
            IHubContext<NotificationHub> hubContext
            , INotificationService NotificationService)
           {
            _IBaseRepository = IBaseRepository;
            _context = context;
            _ImageHelper = ImageHelper;
            _userManager = userManager;
            _hubContext = hubContext;
            _NotificationService = NotificationService;

        }

        public async Task<GetStartedRoom> StartChat(string CurrentUserId,string ReceiverId)
        {
            int chatRoomId = await FindOrCreateChatRoomAsync(CurrentUserId, ReceiverId);

            var (receiverName, receiverImage) = await GetUsersNamesAndImages(ReceiverId);

            return new GetStartedRoom
            {
                RoomId = chatRoomId,
                ReceiverName = receiverName,
                ReceiverImage = receiverImage
            };
        }
        public async Task<List<GetStudentInstructors>> GetStudentInstructors(string userId)
        {
            var studentId = await _IBaseRepository.GetStudentIdByUserId(userId);

            return await _context.Enrollments.Where(e => e.StudentId == studentId)
                .Include(e => e.Course)
                .Select(si => new GetStudentInstructors
                {
                    UserId = si.Course.Instructor.UserId,
                    InstructorId = si.Course.InstructorId,
                    Name = si.Course.Instructor.User.FirstName + " " + si.Course.Instructor.User.LastName,
                    Image = si.Course.Instructor.User.ProfileImage
                }).ToListAsync();
        }
        public async Task<GetSentRoomMessage> SendMessage(string userId, AddClientMessages model)
        {
            int? chatRoomId = 0;

            if (model.ReceiverID == "null" || model.ReceiverID.IsNullOrEmpty())
            {
                return new GetSentRoomMessage
                {
                    Key = ResponseKeys.Failed.ToString()
                };
            }
            if (model.ChatRoomId == 0 || model.ChatRoomId == null )
            {
                chatRoomId = await FindOrCreateChatRoomAsync(userId, model.ReceiverID);
            }
            else
            {
                chatRoomId = model.ChatRoomId;
            }


            var message = new ClientMessages
            {
                Content = model.Content.Trim(),
                SenderID = userId,
                ReceiverID = model.ReceiverID,
                ParentMessageID = model.ParentMessageID,
                Timestamp = _IBaseRepository.GetJordanTime(),
                ClientChatRoomId = chatRoomId ?? 0,
            };

            if (model.File != null)
            {
                if (!model.File.ContentType.StartsWith("image/"))
                {
                    return new GetSentRoomMessage
                    {
                        Key = ResponseKeys.UnsupportedType.ToString()
                    };
                }

                message.FilePath = await _ImageHelper.AddChatFile(model.File);
            }

            var senderUser = await _userManager.FindByIdAsync(userId);

            var ReceiverUser = await _userManager.FindByIdAsync(userId);

            if (ReceiverUser is null)
            {
                return new GetSentRoomMessage
                {
                    Key = ResponseKeys.UserNotFound.ToString()
                };
            }

            await _IBaseRepository.AddAsync<ClientMessages>(message);

            var addedMessage = new GetSentRoomMessage
            {
                Id = message.Id,
                Content = message.Content,
                SenderId = message.SenderID,
                SenderName = senderUser.FirstName + " " + senderUser.FirstName,
                SenderProfileImage = senderUser.ProfileImage,
                ParentMessageID = message.ParentMessageID,
                Timestamp = message.Timestamp,
                File = message.FilePath,
                ChatRoomId = message.ClientChatRoomId,
                Key = ResponseKeys.Success.ToString()
            };

            var messageDto = new
            {
                Id = message.Id,
                ChatRoomId = message.Id,
                Content = message.Content,
                File = message.FilePath,
                ParentMessageID = message.ParentMessageID,
                SenderId = userId,
                SenderName = senderUser.FirstName + " " + senderUser.LastName,
                SenderProfileImage = senderUser.ProfileImage,
                Timestamp = _IBaseRepository.GetJordanTime(),
                Key = ResponseKeys.Success.ToString(),
                CourseId = 0,
                Reactions = new List<ClientMessageReaction>()
            };

            await _hubContext.Clients.Group(message.ClientChatRoomId.ToString()).SendAsync("ReceiveChatRoomMessage", messageDto);

            // await _NotificationService.Notify(NotifyTopics.client.ToString(), $"New Message Received From {senderUser.FirstName + " " + senderUser.LastName}", message.ReceiverID);

            return addedMessage;
        }
        private async Task<int> FindByParticipantsAsync(string userId1, string userId2)
        {
            return await _context.ClientChatRoom
                .Where(c => (c.Participant1Id == userId1 && c.Participant2Id == userId2) ||
                                           (c.Participant1Id == userId2 && c.Participant2Id == userId1))
                .Select(c =>c.Id)
                .FirstOrDefaultAsync();
        }
        private async Task<int> FindOrCreateChatRoomAsync(string userId1, string userId2)
        {
            int chatRoomId = await FindByParticipantsAsync(userId1, userId2);

            if (chatRoomId == 0)
            {
                var newChatRoom = new ClientChatRoom
                {
                    Participant1Id = userId1,
                    Participant2Id = userId2,
                    DateCreated = DateTime.Now
                };

                await _IBaseRepository.AddAsync<ClientChatRoom>(newChatRoom);

                chatRoomId = newChatRoom.Id;
            }

            return chatRoomId;
        }
        public async Task<RoomChatsSummary> GetStudentInstructorRoom(string currentUserId, string UserId)
        {
            var (userName, image) = await GetUsersNamesAndImages(currentUserId);

            var (receiverName, receiverImage) = await GetUsersNamesAndImages(UserId);

            var room = await _context.ClientChatRoom
                .Where(chr => (chr.Participant1Id == currentUserId ||  chr.Participant2Id == currentUserId)
                && (chr.Participant1Id == UserId || chr.Participant2Id == UserId))
                .FirstOrDefaultAsync();

            if (room is null)
            {
                return new RoomChatsSummary();
            }

            var lastMessage = await _context.ClientMessages
               .Where(lm => lm.ClientChatRoomId == room.Id)
               .OrderByDescending(m => m.Timestamp)
               .FirstOrDefaultAsync();

            var receiverId = room.Participant1Id == currentUserId ? room.Participant2Id : room.Participant1Id;


            string lastMassageUserName;
            string lastMassageImage;

            if (lastMessage.SenderID == currentUserId)
            {
                lastMassageUserName = userName;
                lastMassageImage = image;
            }
            else
            {
                lastMassageUserName = receiverName;
                lastMassageImage = receiverImage;
            }

            return new RoomChatsSummary
            {
                CourseName = receiverName,
                CourseImage = receiverImage,
                RoomId = room.Id,
                LastMessageUserName = lastMassageUserName,
                LastMessageUserImage = lastMassageImage,
                LastMessageContent = lastMessage?.Content,
                LastMessageTimestamp = lastMessage?.Timestamp,
                IsLastMessageSeen = _context.UserSeenMessages
                      .Any(usm => usm.UserId == currentUserId && usm.RoomId == room.Id && usm.Type == ChatTypes.DirectMessage &&
                       usm.LastMessageId == lastMessage.Id) ? true : false,
                SenderId = lastMessage?.SenderID,
                ReceiverId = lastMessage?.SenderID == currentUserId ? lastMessage?.ReceiverID : lastMessage?.SenderID
            };
        }
        /* Delete Message & Chat */
        public async Task<string> DeleteMessageForUser(string userId,int messageId)
        {
            var message = await _context.ClientMessages
                .Where(cm => cm.Id == messageId)
                .FirstOrDefaultAsync();

            if(message == null)
            {
                return ResponseKeys.MessageNotFound.ToString();
            }
            if(message.DeletedByUserId == null)
            {
                message.DeletedByUserId = userId;

                _IBaseRepository.Update<ClientMessages>(message);

                return ResponseKeys.Success.ToString();
            }

            _IBaseRepository.Remove<ClientMessages>(message);

            return ResponseKeys.Success.ToString();
        }
        public async Task<string> DeleteRoomChat(string userId, int roomId)
        {
            var room = await _context.ClientChatRoom
                .Where(ccr => ccr.Id == roomId)
                .FirstOrDefaultAsync();

            if (room == null)
            {
                return ResponseKeys.RoomNotFound.ToString();
            }

            if (room.DeletedByUserId == null)
            {
                room.DeletedByUserId = userId;

                return ResponseKeys.Success.ToString();
            }

            //var messages = await _context.ClientMessages.Where(m => m.ClientChatRoomId == room.Id).ToListAsync();

            //_IBaseRepository.RemoveRange<ClientMessages>(messages);

            _IBaseRepository.Remove<ClientChatRoom>(room);

            return ResponseKeys.Success.ToString();
        }
        public async Task<string> DeleteMessage(string userId, int messageId)
        {
            var message = await _context.ClientMessages
                .Where(cm => cm.Id == messageId)
                .FirstOrDefaultAsync();

            if (message == null)
            {
                return ResponseKeys.MessageNotFound.ToString();
            }

            bool isMessagesSender = message.SenderID == userId;

            if (!isMessagesSender)
            {
               return ResponseKeys.UnauthorizedAccess.ToString();
            }

            if (message.FilePath != null)
            {
               await _ImageHelper.DeleteChatFile(message.FilePath);
            }

            message.IsDeleted = true;

            _IBaseRepository.Update<ClientMessages>(message);

            var childMessages = await _context.ClientMessages
                .Where(cm => cm.ParentMessageID == messageId)
                .ToListAsync();

            if (childMessages.Count > 0)
            {
                _IBaseRepository.RemoveRange<ClientMessages>(childMessages);
            }

            await _hubContext.Clients.Group(message.ClientChatRoomId.ToString()).SendAsync("MessageDeleted", messageId);

            return ResponseKeys.Success.ToString();
        }

                               /* Get Room Chat Messages */
        public async Task<List<GetClientRoomMessages>> GetRoomMessages(string userId , int roomId)
        {
            var room = await _context.ClientChatRoom.Where(ccr => ccr.Id == roomId)
                .FirstOrDefaultAsync();

            if(room is null)
            {
                return new List<GetClientRoomMessages>();
            }

            var messages = await _context.ClientMessages
             .Where(m => m.ClientChatRoomId == roomId && m.DeletedByUserId != userId)
             .Include(m => m.ClientChatRoom)
             .Include(m => m.Reactions)
             .ThenInclude(m => m.User)
             .OrderBy(m => m.Timestamp)
             .ToListAsync();

            string participant1Id = room.Participant1Id; 
       
            string participant2Id = room.Participant2Id;

            (string participant1Name, string participant1Image) = await GetUsersNamesAndImages(participant1Id);

            (string participant2Name, string participant2Image) = await GetUsersNamesAndImages(participant2Id);

            var clientRoomMessages = messages.Select(m => new GetClientRoomMessages
            {
                Id = m.Id,
                SenderId = m.SenderID,
                SenderName = m.SenderID == participant1Id ? participant1Name : participant2Name,
                SenderProfileImage = m.SenderID == participant1Id ? participant1Image : participant2Image,
                ParentMessageID = m.ParentMessageID,
                Content = m.Content,
                File = m.FilePath,
                Timestamp = m.Timestamp,
                IsSenderCurrentUser = m.SenderID == userId,
                Reactions = m.Reactions != null? m.Reactions.Select(r => new ClientMessageReaction
                {
                    Id = r.Id,
                    UserId = r.UserId,
                    UserImage = r.User.ProfileImage,
                    UserName = r.User.FirstName + " " + r.User.LastName,
                    Emoji = r.Emoji
                }).ToList() : new List<ClientMessageReaction>()
            }).ToList();

            await MarkAsSeen(userId, roomId);

            return clientRoomMessages;
        }

        /* Get User Room Chats */
        public async Task<List<RoomChatsSummary>> GetChatSummaries(string userId)
        {
            var (userName, image) = await GetUsersNamesAndImages(userId);

            var userRole = await _IBaseRepository.FindUserRole(userId);

            var userRooms = await _context.ClientChatRoom
                .Where(cm => cm.Participant1Id == userId || cm.Participant2Id == userId)
                .Select(cm => new { cm.Id, cm.Participant1Id, cm.Participant2Id })
                .ToListAsync();

            var otherUserIds = userRooms
                .SelectMany(room => new[] { room.Participant1Id, room.Participant2Id })
                .Where(id => id != userId)
                .Distinct()
                .ToList();

            var otherUsers = await _context.Users
                .Where(u => otherUserIds.Contains(u.Id))
                .Select(u => new { u.Id, FullName = u.FirstName + " " + u.LastName, u.ProfileImage })
                .ToListAsync();

            var lastMessages = await _context.ClientMessages
                .Where(m => userRooms.Select(r => r.Id).Contains(m.ClientChatRoomId))
                .GroupBy(m => m.ClientChatRoomId)
                .Select(g => g.OrderByDescending(m => m.Timestamp).FirstOrDefault())
                .ToListAsync();

            var activeUsers = await _context.Sessions
              .Where(s => s.Status == SessionStatus.Active)
              .Select(s => s.UserId)
              .ToListAsync();

            var rooms = new List<RoomChatsSummary>();

            foreach (var room in userRooms) {
                var roomChat = new RoomChatsSummary();
                var lastMessage = lastMessages.FirstOrDefault(m => m.ClientChatRoomId == room.Id);
                var receiverId = room.Participant1Id == userId ? room.Participant2Id : room.Participant1Id;
                var receiver = otherUsers.FirstOrDefault(u => u.Id == receiverId);
                var lastMessageUser = otherUsers.FirstOrDefault(u => u.Id == lastMessage?.SenderID);
                if (lastMessage is null)
                {
                  if ( userRole == Roles.Instructor.ToString())
                  {
                      continue;
                  }
                  roomChat.CourseName = receiver?.FullName;
                  roomChat.CourseImage = receiver?.ProfileImage;
                  roomChat.RoomId = room.Id;
                }
                else
                {
                    roomChat.CourseName = receiver?.FullName;
                    roomChat.CourseImage = receiver?.ProfileImage;
                    roomChat.RoomId = room.Id;
                    roomChat.LastMessageUserName = lastMessageUser?.FullName;
                    roomChat.LastMessageUserImage = lastMessageUser?.ProfileImage;
                    roomChat.LastMessageContent = lastMessage?.Content;
                    roomChat.LastMessageTimestamp = lastMessage?.Timestamp;
                    roomChat.IsLastMessageSeen = _context.UserSeenMessages
                       .Any(usm => usm.UserId == userId && usm.RoomId == room.Id && usm.Type == ChatTypes.DirectMessage &&
                     usm.LastMessageId == lastMessage.Id) ? true : false;
                    roomChat.SenderId = lastMessage?.SenderID;
                    roomChat.ReceiverId = lastMessage?.SenderID == userId ? lastMessage?.ReceiverID : lastMessage?.SenderID;
                    roomChat.IsOnline = userRole == Roles.Instructor.ToString() ? activeUsers.Contains(receiver.Id) : false;
                }
                rooms.Add(roomChat);
           
            }

            return rooms;
        }
        /* Get Message Reactions  */
        public async Task<GetAddedReaction> AddReaction(string userId,AddReaction model)
        {
            var message = await _context.ClientMessages
                .Where(cm => cm.Id == model.MessageId)
                .FirstOrDefaultAsync();

            if (message is null)
            {
                return new GetAddedReaction
                {
                    Key = ResponseKeys.MessageNotFound.ToString()
                };
            }

            var isReactionExists = await _context.ClientMessagesReaction
                .AnyAsync(cmr => cmr.ClientMessagesId == message.Id && cmr.UserId == userId);

            if (isReactionExists)
            {
                return new GetAddedReaction
                {
                    Key = ResponseKeys.Failed.ToString()
                };
            }

            var reaction = new ClientMessagesReaction
            {
                ClientMessagesId = message.Id,
                Emoji = model.Emoji,
                UserId = userId
            };

            (string userName, string UserImage) = await GetUsersNamesAndImages(userId);


            await _IBaseRepository.AddAsync<ClientMessagesReaction>(reaction);

            var addedReaction = new
            {
                Id = reaction.Id,
                MessageId = message.Id,
                Emoji = reaction.Emoji,
                UserId = userId,
                UserName = userName,
                UserImage = UserImage,
            };

            await _hubContext.Clients.Group(message.ClientChatRoomId.ToString()).SendAsync("ReactionAdded", addedReaction);


            return new GetAddedReaction
            {
                Id = reaction.Id,
                MessageId = message.Id,
                Emoji = reaction.Emoji,
                UserId = userId,
                UserName = userName,
                UserImage = UserImage,
                Key = ResponseKeys.Success.ToString()
            };
        }
        public async Task<GetAddedReaction> UpdateReaction(string userId, UpdateReaction model)
        {
            var message = await _context.ClientMessages
                .Where(cm => cm.Id == model.MessagesId)
                .FirstOrDefaultAsync();

            if (message is null)
            {
                return new GetAddedReaction
                {
                    Key = ResponseKeys.MessageNotFound.ToString()
                };
            }

            var reaction = await _context.ClientMessagesReaction
                .Where(cmr => cmr.Id == model.Id) 
                .FirstOrDefaultAsync();

            if (reaction is null)
            {
                return new GetAddedReaction
                {
                    Key = ResponseKeys.ReActionNotFound.ToString()
                };
            }

            if(reaction.UserId != userId)
            {
                return new GetAddedReaction
                {
                    Key = ResponseKeys.UnauthorizedAccess.ToString()
                };
            }

            reaction.Emoji = model.Emoji;

            _IBaseRepository.Update<ClientMessagesReaction>(reaction);


            (string userName, string UserImage) = await GetUsersNamesAndImages(userId);

            var updatedReaction = new
            {
                Id = reaction.Id,
                MessageId = message.Id,
                Emoji = reaction.Emoji,
                UserId = userId,
                UserName = userName,
                UserImage = UserImage,
            };
            await _hubContext.Clients.Group(message.ClientChatRoomId.ToString()).SendAsync("ReactionAdded", updatedReaction);

            return new GetAddedReaction
            {
                Id = reaction.Id,
                MessageId = message.Id,
                Emoji = reaction.Emoji,
                UserId = userId,
                UserName = userName,
                UserImage = UserImage,
                Key = ResponseKeys.Success.ToString()
            };
        }
        public async Task<string> DeleteReaction(string userId,int reActionId)
        {
            var reaction = await _context.ClientMessagesReaction
              .Where(cmr => cmr.Id == reActionId)
              .Include(cmr => cmr.ClientMessages)
              .FirstOrDefaultAsync();

            if (reaction is null)
            {
                return ResponseKeys.ReActionNotFound.ToString();
            }

            if (reaction.UserId != userId)
            {
                return ResponseKeys.UnauthorizedAccess.ToString();
            }

            var removedReaction = new
            {
                id = reaction.Id,
                messageId = reaction.ClientMessagesId,
                userId = reaction.UserId
            };

            await _hubContext.Clients.Group(reaction.ClientMessages.ClientChatRoomId.ToString()).SendAsync("ReactionRemoved", removedReaction);

            _IBaseRepository.Remove<ClientMessagesReaction>(reaction);

            return ResponseKeys.Success.ToString();
        }
        private async Task<string> MarkAsSeen(string userId, int roomId)
        {

            var lastMessageId = await _context.ClientMessages
              .Where(crm => crm.ClientChatRoomId == roomId)
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
                Type = ChatTypes.DirectMessage,
                UserId = userId,
            };

            await _IBaseRepository.AddAsync<UserSeenMessages>(UserSeenMessages);

            return ResponseKeys.Success.ToString();
        }
        private async Task<(string name, string profileImage)> GetUsersNamesAndImages(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            return (user.FirstName + " " + user.LastName, user.ProfileImage);
        }

    }
}
