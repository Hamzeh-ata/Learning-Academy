using Arkan.Server.BaseRepository;
using Arkan.Server.ClientMessagesModels;
using Arkan.Server.Data;
using Arkan.Server.Enums;
using Arkan.Server.ImagesHelper;
using Arkan.Server.Messages_Interfaces;
using Arkan.Server.Models;
using Arkan.Server.Notifications;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace Arkan.Server.Messages_Services
{
    public class ChatRoomRepository : IChatRoom
    {
        private readonly IBaseRepository _IBaseRepository;
        private readonly ApplicationDBContext _context;
        private readonly ImageHelperInterface _ImageHelper;
        private readonly UserManager<ApplicationUser> _userManager;
        IHubContext<NotificationHub> _hubContext;
        private readonly INotificationService _NotificationService;
        public ChatRoomRepository(IBaseRepository IBaseRepository
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
        public async Task<List<GetCoursesRoomMessages>> GetRoomMessages(string userId, int roomId, int pageNumber, int pageSize)
        {
            var courseId = await _context.CoursesChatRooms
                .Where(cr => cr.Id == roomId)
                .Select(cr => cr.CourseId)
                .FirstOrDefaultAsync();
            var messages = await _context.CoursesRoomMessages
                .Where(m => m.CoursesChatRooms.Id == roomId)
                .Include(m => m.User)
                .Include(m => m.Reactions)
                .ThenInclude(m => m.User)
                .OrderBy(m => m.Timestamp)
                .Select(m => new GetCoursesRoomMessages
                {
                    Id = m.Id,
                    Content = m.Content,
                    File = m.FilePath,
                    SenderId = m.UserId,
                    SenderName = m.User.FirstName + " " + m.User.LastName,
                    SenderProfileImage = m.User.ProfileImage,
                    IsSenderCurrentUser = m.UserId == userId,
                    Timestamp = m.Timestamp,
                    ParentMessageID = m.ParentMessageID,
                    IsDeleted = m.IsDeleted,
                    Reactions = m.Reactions != null ? m.Reactions.Select(r => new RoomMessageReaction
                    {
                        Id = r.Id,
                        UserId = r.UserId,
                        UserName = r.User.FirstName + " " + r.User.LastName,
                        UserImage = r.User.ProfileImage,
                        Emoji = r.Emoji
                    }).ToList() : new List<RoomMessageReaction>()
                })
                .ToListAsync();

            await MarkAsSeen(userId, roomId);

            return messages;
        }
        public async Task<GetSentRoomMessage> SendMessage(string userId, SendRoomMessage model)
        {
            var chatRoom = await _context.CoursesChatRooms.FirstOrDefaultAsync(c => c.CourseId == model.CourseId);

            if (chatRoom == null)
            {
                return new GetSentRoomMessage
                {
                    Key = ResponseKeys.RoomNotFound.ToString()
                };
            }

            var mutedStudent = await _context.CoursesChatMutedStudents
            .FirstOrDefaultAsync(ms => ms.UserId == userId && ms.CourseId == model.CourseId);

            if (mutedStudent != null)
            {
                return new GetSentRoomMessage { Key = "You have been muted from this room" };
            }

            var user = await _userManager.FindByIdAsync(userId);

            var newMessage = new CoursesRoomMessages
            {
                CoursesChatRoomsId = chatRoom.Id,
                Content = model.Content.Trim(),
                UserId = userId,
                Timestamp = DateTime.UtcNow,
                ParentMessageID = model.ParentMessageID,
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

                newMessage.FilePath = await _ImageHelper.AddChatFile(model.File);
            }

            await _IBaseRepository.AddAsync(newMessage);

            var messageDto = new
            {
                Id = newMessage.Id,
                RoomId = chatRoom.Id,
                Content = newMessage.Content,
                File = newMessage.FilePath,
                ParentMessageID = newMessage.ParentMessageID,
                SenderId = userId,
                SenderName = user.FirstName + " " + user.LastName,
                SenderProfileImage = user.ProfileImage,
                Timestamp = _IBaseRepository.GetJordanTime(),
                CourseId = chatRoom.CourseId,
                Reactions = new List<ClientMessageReaction>()
            };

            await _hubContext.Clients.Group(newMessage.CoursesChatRoomsId.ToString()).SendAsync("ReceiveChatRoomMessage", messageDto);

            return new GetSentRoomMessage
            {
                Id = newMessage.Id,
                ChatRoomId = chatRoom.Id,
                Content = newMessage.Content,
                File = newMessage.FilePath,
                ParentMessageID = newMessage.ParentMessageID,
                SenderId = userId,
                SenderName = user.FirstName + " " + user.LastName,
                SenderProfileImage = user.ProfileImage,
                Timestamp = _IBaseRepository.GetJordanTime(),
                CourseId = chatRoom.CourseId,
                Key = ResponseKeys.Success.ToString()
            };
        }
        public async Task<string> DeleteMessage(string userId, int messageId)
        {
            var message = await _context.CoursesRoomMessages
                .Where(cm => cm.Id == messageId)
                .FirstOrDefaultAsync();

            if (message == null)
            {
                return ResponseKeys.MessageNotFound.ToString();
            }

            bool isMessagesSender = message.UserId == userId;

            if (!isMessagesSender)
            {
                return ResponseKeys.UnauthorizedAccess.ToString();
            }

            if (message.FilePath != null)
            {
                await _ImageHelper.DeleteChatFile(message.FilePath);
            }

            message.IsDeleted = true;

            _IBaseRepository.Update<CoursesRoomMessages>(message);

            await _context.CoursesRoomMessages
            .Where(cm => cm.ParentMessageID == messageId)
            .ForEachAsync(cm => cm.ParentMessageID = 0);


            var messageReactions = await _context.CoursesMessagesReactions
                .Where(r => r.CoursesRoomMessagesId == messageId)
                .ToListAsync();

            if (messageReactions.Any())
            {
                _IBaseRepository.RemoveRange<CoursesMessagesReaction>(messageReactions);
            }

            await _hubContext.Clients.Group(message.CoursesChatRoomsId.ToString()).SendAsync("MessageDeleted", messageId);

            return ResponseKeys.Success.ToString();
        }
        public async Task<GetAddedReaction> AddReaction(string userId, AddReaction model)
        {
            var message = await _context.CoursesRoomMessages
                .Where(cm => cm.Id == model.MessageId)
                .FirstOrDefaultAsync();

            if (message is null)
            {
                return new GetAddedReaction
                {
                    Key = ResponseKeys.MessageNotFound.ToString()
                };
            }

            var isReactionExists = await _context.CoursesMessagesReactions
                .AnyAsync(cmr => cmr.CoursesRoomMessagesId == message.Id && cmr.UserId == userId);

            if (isReactionExists)
            {
                return new GetAddedReaction
                {
                    Key = ResponseKeys.Failed.ToString()
                };
            }

            var courseId = await _context.CoursesChatRooms
              .Where(cr => cr.Id == message.CoursesChatRoomsId)
              .Select(cr => cr.CourseId)
              .FirstOrDefaultAsync();

            var isMuted = await _context.CoursesChatMutedStudents
          .AnyAsync(ms => ms.UserId == userId && ms.CourseId == courseId);

            if (isMuted)
            {
                return new GetAddedReaction
                {
                    Key = "You have been muted from this room"
                };
            }

            var reaction = new CoursesMessagesReaction
            {
                CoursesRoomMessagesId = message.Id,
                Emoji = model.Emoji,
                UserId = userId
            };

            await _IBaseRepository.AddAsync<CoursesMessagesReaction>(reaction);

            var user = await _userManager.FindByIdAsync(userId);

            var addedReaction = new
            {
                Id = reaction.Id,
                MessageId = message.Id,
                Emoji = reaction.Emoji,
                UserId = userId,
                UserName = user.FirstName + " " + user.LastName,
                UserImage = user.ProfileImage,
            };

            await _hubContext.Clients.Group(message.CoursesChatRoomsId.ToString()).SendAsync("ReactionAdded", addedReaction);

            return new GetAddedReaction
            {
                Id = reaction.Id,
                MessageId = message.Id,
                Emoji = reaction.Emoji,
                UserId = userId,
                Key = ResponseKeys.Success.ToString()
            };
        }
        public async Task<GetAddedReaction> UpdateReaction(string userId, UpdateReaction model)
        {
            var message = await _context.CoursesRoomMessages
                .Where(cm => cm.Id == model.MessagesId)
                .FirstOrDefaultAsync();

            if (message is null)
            {
                return new GetAddedReaction
                {
                    Key = ResponseKeys.MessageNotFound.ToString()
                };
            }

            var reaction = await _context.CoursesMessagesReactions
                .Where(cmr => cmr.Id == model.Id)
                .FirstOrDefaultAsync();

            if (reaction is null)
            {
                return new GetAddedReaction
                {
                    Key = ResponseKeys.ReActionNotFound.ToString()
                };
            }

            if (reaction.UserId != userId)
            {
                return new GetAddedReaction
                {
                    Key = ResponseKeys.UnauthorizedAccess.ToString()
                };
            }

            var courseId = await _context.CoursesChatRooms
             .Where(cr => cr.Id == message.CoursesChatRoomsId)
             .Select(cr => cr.CourseId)
             .FirstOrDefaultAsync();

            var isMuted = await _context.CoursesChatMutedStudents
          .AnyAsync(ms => ms.UserId == userId && ms.CourseId == courseId);

            if (isMuted)
            {
                return new GetAddedReaction
                {
                    Key = "You have been muted from this room"
                };
            }

            reaction.Emoji = model.Emoji;

            var user = await _userManager.FindByIdAsync(userId);

            _IBaseRepository.Update<CoursesMessagesReaction>(reaction);

            var addedReaction = new
            {
                Id = reaction.Id,
                MessageId = message.Id,
                Emoji = reaction.Emoji,
                UserId = userId,
                UserName = user.FirstName + " " + user.LastName,
                UserImage = user.ProfileImage,
            };

            await _hubContext.Clients.Group(message.CoursesChatRoomsId.ToString()).SendAsync("ReactionAdded", addedReaction);

            return new GetAddedReaction
            {
                Id = reaction.Id,
                MessageId = message.Id,
                Emoji = reaction.Emoji,
                UserId = userId,
                UserName = user.FirstName + " " + user.LastName,
                UserImage = user.ProfileImage,
                Key = ResponseKeys.Success.ToString()
            };
        }
        public async Task<string> DeleteReaction(string userId, int reActionId)
        {
            var reaction = await _context.CoursesMessagesReactions
              .Where(cmr => cmr.Id == reActionId)
              .Include(cmr => cmr.CoursesRoomMessages)
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
                Id = reaction.Id,
                MessageId = reaction.CoursesRoomMessagesId,
                Emoji = reaction.Emoji,
                UserId = userId,
            };

            await _hubContext.Clients.Group(reaction.CoursesRoomMessages.CoursesChatRoomsId.ToString()).SendAsync("ReactionRemoved", removedReaction);

            _IBaseRepository.Remove<CoursesMessagesReaction>(reaction);

            return ResponseKeys.Success.ToString();
        }
        public async Task<string> MarkAsSeen(string userId, int roomId)
        {

            var lastMessageId = await _context.CoursesRoomMessages
              .Where(crm => crm.CoursesChatRoomsId == roomId)
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
                Type = ChatTypes.Room,
                UserId = userId,
            };

            await _IBaseRepository.AddAsync<UserSeenMessages>(UserSeenMessages);

            return ResponseKeys.Success.ToString();
        }
        public async Task<List<RoomChatsSummary>> GetUserCourseRooms(string userId)
        {
            int? studentId = null;

            int? instructorId = null;

            var userRole = await _IBaseRepository.FindUserRole(userId);

            if (userRole == null)
            {
                return new List<RoomChatsSummary>();
            }

            if (userRole == Roles.Instructor.ToString())
            {
                instructorId = await _IBaseRepository.GetInstructorIdByUserID(userId);

                var instructorCourses = await _context
                    .Courses.Where(c => c.InstructorId == instructorId)
                    .Select(c => c.Id)
                    .ToListAsync();

                var courseUsersCount = await _context
                 .Enrollments.Where(e => instructorCourses.Contains(e.CourseId))
                 .GroupBy(e => e.CourseId)
                 .Select(g => new { CourseId = g.Key, Count = g.Count() })
                 .ToDictionaryAsync(x => x.CourseId, x => x.Count);

                return await _context.CoursesChatRooms
               .Where(cr => instructorCourses.Contains(cr.CourseId))
               .Include(cr => cr.CoursesRoomMessages)
               .Select(cr => new RoomChatsSummary
               {
                   UserId = userId,
                   RoomId = cr.Id,
                   CourseId = cr.CourseId,
                   CourseName = cr.Course.Name,
                   CourseImage = cr.Course.Image,
                   LastMessageContent = cr.CoursesRoomMessages.OrderByDescending(cm => cm.Timestamp).Select(cm => cm.Content).FirstOrDefault(),
                   LastMessageTimestamp = cr.CoursesRoomMessages.Any() ? cr.CoursesRoomMessages.OrderByDescending(cm => cm.Timestamp).Select(cm => cm.Timestamp).FirstOrDefault() : null,
                   LastMessageUserName = cr.CoursesRoomMessages.OrderByDescending(cm => cm.Timestamp).Select(cm => cm.User.FirstName + " " + cm.User.LastName).FirstOrDefault(),
                   LastMessageUserImage = cr.CoursesRoomMessages.OrderByDescending(cm => cm.Timestamp).Select(cm => cm.User.ProfileImage).FirstOrDefault(),
                   UsersCount = courseUsersCount.ContainsKey(cr.CourseId) ? courseUsersCount[cr.CourseId] : 0,
                   IsLastMessageSeen = cr.CoursesRoomMessages.Any() ? _context.UserSeenMessages
                       .Any(usm => usm.UserId == userId && usm.RoomId == cr.Id && usm.Type == ChatTypes.Room &&
                           usm.LastMessageId == cr.CoursesRoomMessages.OrderByDescending(cm => cm.Timestamp).Select(cm => cm.Id).FirstOrDefault()) : true,
               })
               .OrderByDescending(r => r.LastMessageTimestamp ?? DateTime.MinValue)
               .ToListAsync();

            }

            studentId = await _IBaseRepository.GetStudentIdByUserId(userId);

            var studentCoursesIds = await _context.Enrollments
            .Where(e => e.StudentId == studentId)
            .Select(e => e.CourseId)
            .ToListAsync();

            var studentCoursesUsersCount = await _context
               .Enrollments.Where(e => studentCoursesIds.Contains(e.CourseId))
               .GroupBy(e => e.CourseId)
               .Select(g => new { CourseId = g.Key, Count = g.Count() })
               .ToDictionaryAsync(x => x.CourseId, x => x.Count);

            var mutedUsers = await _context.CoursesChatMutedStudents
           .Where(m => studentCoursesIds.Contains(m.CourseId))
           .Select(m => m.UserId)
           .ToListAsync();

            return await _context.CoursesChatRooms
               .Where(cr => studentCoursesIds.Contains(cr.CourseId))
               .Include(cr => cr.CoursesRoomMessages)
               .Select(cr => new RoomChatsSummary
               {
                   UserId = userId,
                   RoomId = cr.Id,
                   CourseId = cr.CourseId,
                   CourseName = cr.Course.Name,
                   CourseImage = cr.Course.Image,
                   LastMessageContent = cr.CoursesRoomMessages.OrderByDescending(cm => cm.Timestamp).Select(cm => cm.Content).FirstOrDefault(),
                   LastMessageTimestamp = cr.CoursesRoomMessages.Any() ? cr.CoursesRoomMessages.OrderByDescending(cm => cm.Timestamp).Select(cm => cm.Timestamp).FirstOrDefault() : null,
                   LastMessageUserName = cr.CoursesRoomMessages.OrderByDescending(cm => cm.Timestamp).Select(cm => cm.User.FirstName + " " + cm.User.LastName).FirstOrDefault(),
                   LastMessageUserImage = cr.CoursesRoomMessages.OrderByDescending(cm => cm.Timestamp).Select(cm => cm.User.ProfileImage).FirstOrDefault(),
                   UsersCount = studentCoursesUsersCount.ContainsKey(cr.CourseId) ? studentCoursesUsersCount[cr.CourseId] : 0,
                   IsLastMessageSeen = cr.CoursesRoomMessages.Any() ? _context.UserSeenMessages
                        .Any(usm => usm.UserId == userId && usm.RoomId == cr.Id && usm.Type == ChatTypes.Room &&
                            usm.LastMessageId == cr.CoursesRoomMessages.OrderByDescending(cm => cm.Timestamp).Select(cm => cm.Id).FirstOrDefault()) : true,
                   IsMuted = mutedUsers.Contains(userId),
               })
               .OrderByDescending(r => r.LastMessageTimestamp ?? DateTime.MinValue)
               .ToListAsync();

        }

        public async Task<List<RoomChatsSummary>> GetAllCourseRooms()
        {
            return await _context.CoursesChatRooms
               .Include(cr => cr.CoursesRoomMessages)
               .Select(cr => new RoomChatsSummary
               {
                   RoomId = cr.Id,
                   CourseId = cr.CourseId,
                   CourseName = cr.Course.Name,
                   CourseImage = cr.Course.Image,
                   LastMessageContent = cr.CoursesRoomMessages.OrderByDescending(cm => cm.Timestamp).Select(cm => cm.Content).FirstOrDefault(),
                   LastMessageTimestamp = cr.CoursesRoomMessages.Any() ? cr.CoursesRoomMessages.OrderByDescending(cm => cm.Timestamp).Select(cm => cm.Timestamp).FirstOrDefault() : null,
                   LastMessageUserName = cr.CoursesRoomMessages.OrderByDescending(cm => cm.Timestamp).Select(cm => cm.User.FirstName + " " + cm.User.LastName).FirstOrDefault(),
                   LastMessageUserImage = cr.CoursesRoomMessages.OrderByDescending(cm => cm.Timestamp).Select(cm => cm.User.ProfileImage).FirstOrDefault(),
               })
               .OrderByDescending(r => r.LastMessageTimestamp ?? DateTime.MinValue)
               .ToListAsync();
        }
        public async Task<List<RoomUsers>> GetRoomUsers(int roomId, string currentUserId)
        {
            var userRole = await _IBaseRepository.FindUserRole(currentUserId);

            var roomCourseId = await _context.CoursesChatRooms
               .Where(cr => cr.Id == roomId)
               .Select(r => r.CourseId)
               .FirstOrDefaultAsync();

            var mutedUsers = await _context.CoursesChatMutedStudents
                .Where(m => m.CourseId == roomCourseId)
                .Select(m => m.UserId)
                .ToListAsync();

            var activeUsers = await _context.Sessions
                .Where(s => s.Status == SessionStatus.Active)
                .Select(s => s.UserId)
                .ToListAsync();


            if (userRole == Roles.Student.ToString())
            {
                var instructorId = await _context.Courses
                    .Where(c => c.Id == roomCourseId)
                    .Select(c => c.InstructorId)
                    .FirstOrDefaultAsync();

                var instructorUserId = await _context.Instructors
                    .Where(i => i.Id == instructorId)
                    .Select(i => i.UserId)
                    .FirstOrDefaultAsync();

                var instructorUser = await _userManager.FindByIdAsync(instructorUserId);

                return new List<RoomUsers>
                {
                  new RoomUsers
                  {
                      UserId = instructorUserId,
                      UserName = instructorUser.FirstName + " " + instructorUser.LastName,
                      ProfileImage = instructorUser.ProfileImage,
                  }
              };
            }

            return await _context.Enrollments
                .Where(e => e.CourseId == roomCourseId)
                .Include(e => e.Student)
                .ThenInclude(e => e.User)
                .Select(e => new RoomUsers
                {
                    UserId = e.Student.UserId,
                    UserName = e.Student.User.FirstName + " " + e.Student.User.LastName,
                    ProfileImage = e.Student.User.ProfileImage,
                    IsMuted = mutedUsers.Contains(e.Student.UserId),
                    IsOnline = activeUsers.Contains(e.Student.UserId),
                })
                .ToListAsync();
        }


        public async Task<List<RoomUsers>> GetAllRoomUsers(int roomId)
        {

            var roomCourseId = await _context.CoursesChatRooms
               .Where(cr => cr.Id == roomId)
               .Select(r => r.CourseId)
               .FirstOrDefaultAsync();

            var mutedUsers = await _context.CoursesChatMutedStudents
                .Where(m => m.CourseId == roomCourseId)
                .Select(m => m.UserId)
                .ToListAsync();

            return await _context.Enrollments
                .Where(e => e.CourseId == roomCourseId)
                .Include(e => e.Student)
                .ThenInclude(e => e.User)
                .Select(e => new RoomUsers
                {
                    UserId = e.Student.UserId,
                    UserName = e.Student.User.FirstName + " " + e.Student.User.LastName,
                    ProfileImage = e.Student.User.ProfileImage,
                    IsMuted = mutedUsers.Contains(e.Student.UserId),
                })
                .ToListAsync();
        }


        public async Task<List<string>> GetRoomAttachments(int roomId)
        {
            var chatRoom = await _context.CoursesChatRooms
                .Where(cr => cr.Id == roomId)
                .FirstOrDefaultAsync();

            if (chatRoom == default)
            {
                return new List<string>();
            }
            return await _context.CoursesRoomMessages
                .Where(cm => cm.CoursesChatRoomsId == roomId && cm.FilePath != null && !cm.IsDeleted)
                .OrderBy(cm => cm.Timestamp)
                .Select(cm => cm.FilePath)
                .ToListAsync();
        }
        public async Task<string> MuteStudent(int roomId, string currentUserId, string studentUserId)
        {

            var userRole = await _IBaseRepository.FindUserRole(currentUserId);

            if (userRole == Roles.Student.ToString())
            {
                return ResponseKeys.UnauthorizedAccess.ToString();
            }

            var roomCourse = await _context.CoursesChatRooms
                .Where(cr => cr.Id == roomId)
                .FirstOrDefaultAsync();

            var isMutedBefore = await _context.CoursesChatMutedStudents
                .AnyAsync(chms => chms.CourseId == roomCourse.CourseId && chms.UserId == studentUserId);

            if (isMutedBefore)
            {
                return ResponseKeys.Success.ToString();

            }

            var muteStudent = new CoursesChatMutedStudents
            {
                CourseId = roomCourse.CourseId,
                UserId = studentUserId
            };

            var muteObject = new
            {
                IsMuted = true,
                roomId,
                UserId = studentUserId
            };

            await _hubContext.Clients.Group(roomId.ToString()).SendAsync("MuteListener", muteObject);

            await _IBaseRepository.AddAsync<CoursesChatMutedStudents>(muteStudent);

            return ResponseKeys.Success.ToString();
        }
        public async Task<string> UnMuteStudent(int roomId, string currentUserId, string studentUserId)
        {

            var userRole = await _IBaseRepository.FindUserRole(currentUserId);

            if (userRole == Roles.Student.ToString())
            {
                return ResponseKeys.UnauthorizedAccess.ToString();
            }

            var roomCourse = await _context.CoursesChatRooms
                .Where(cr => cr.Id == roomId)
                .FirstOrDefaultAsync();


            if (roomCourse == default)
            {
                return ResponseKeys.RoomNotFound.ToString();
            }

            var mutedStudent = await _context.CoursesChatMutedStudents
                .Where(cm => cm.UserId == studentUserId && cm.CourseId == roomCourse.CourseId)
                .FirstOrDefaultAsync();

            if (mutedStudent == default)
            {
                return ResponseKeys.UserNotFound.ToString();
            }

            var muteObject = new
            {
                IsMuted = false,
                roomId,
                UserId = studentUserId
            };

            await _hubContext.Clients.Group(roomId.ToString()).SendAsync("MuteListener", muteObject);

            _IBaseRepository.Remove<CoursesChatMutedStudents>(mutedStudent);

            return ResponseKeys.Success.ToString();
        }





        public async Task<string> MuteStudent(int roomId,string studentUserId)
        {

            var roomCourse = await _context.CoursesChatRooms
                .Where(cr => cr.Id == roomId)
                .FirstOrDefaultAsync();

            var isMutedBefore = await _context.CoursesChatMutedStudents
             .AnyAsync(chms => chms.CourseId == roomCourse.CourseId && chms.UserId == studentUserId);

            if (isMutedBefore)
            {
                return ResponseKeys.Success.ToString();

            }

            var muteStudent = new CoursesChatMutedStudents
            {
                CourseId = roomCourse.CourseId,
                UserId = studentUserId
            };

            var muteObject = new
            {
                IsMuted = true,
                roomId,
                UserId = studentUserId
            };

            await _hubContext.Clients.Group(roomId.ToString()).SendAsync("MuteListener", muteObject);

            await _IBaseRepository.AddAsync<CoursesChatMutedStudents>(muteStudent);

            return ResponseKeys.Success.ToString();
        }
        public async Task<string> UnMuteStudent(int roomId, string studentUserId)
        {
            var roomCourse = await _context.CoursesChatRooms
                .Where(cr => cr.Id == roomId)
                .FirstOrDefaultAsync();


            if (roomCourse == default)
            {
                return ResponseKeys.RoomNotFound.ToString();
            }

            var mutedStudent = await _context.CoursesChatMutedStudents
                .Where(cm => cm.UserId == studentUserId && cm.CourseId == roomCourse.CourseId)
                .FirstOrDefaultAsync();

            if (mutedStudent == default)
            {
                return ResponseKeys.UserNotFound.ToString();
            }

            var muteObject = new
            {
                IsMuted = false,
                roomId,
                UserId = studentUserId
            };

            await _hubContext.Clients.Group(roomId.ToString()).SendAsync("MuteListener", muteObject);

            _IBaseRepository.Remove<CoursesChatMutedStudents>(mutedStudent);

            return ResponseKeys.Success.ToString();
        }





    }
}

