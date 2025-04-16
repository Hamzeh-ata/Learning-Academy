using Arkan.Server.BaseRepository;
using Arkan.Server.Data;
using Arkan.Server.Enums;
using Arkan.Server.Models;
using Arkan.Server.PageModels.NotificationModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using SendGrid.Helpers.Mail;
using System.Runtime.InteropServices;

namespace Arkan.Server.Notifications
{
    public class NotificationService : INotificationService
    {
        private readonly IHubContext<NotificationHub> _hubContext;
        private readonly ApplicationDBContext _context;
        private readonly IBaseRepository _IBaseRepository;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public NotificationService(IHubContext<NotificationHub> hubContext, ApplicationDBContext context, IBaseRepository IBaseRepository
            , IHttpContextAccessor httpContextAccessor)
        {
            _hubContext = hubContext;
            _context = context;
            _IBaseRepository = IBaseRepository;
            _httpContextAccessor = httpContextAccessor;

        }
        public async Task Notify(string topic, string notificationMessage, string userId)
        {

            var loggedInUserId = await GetLoggedInUserIdAsync();

            if (loggedInUserId == userId)
            {
            switch (topic.ToLower())
                {
                    case "client":

                    await _hubContext.Clients.Group(topic).SendAsync("ReceiveNotification", notificationMessage);

                    break;
                }
            }
        }
        public async Task NotifyAdmin(string topic, string notificationMessage, AdminNotifications type)
        {
            var loggedInUserId = await GetLoggedInUserIdAsync();

            var permissionedAdmins = await PermissionedAdmins(type);

            foreach (var userId in permissionedAdmins)
            {
                    switch (topic.ToLower())
                    {
                        case "admin":

                            await _hubContext.Clients.Group(topic).SendAsync("ReceiveNotification", notificationMessage);

                            break;
                    }
            }
        }
        public async Task<GetHumanMadeNotification> AddHumanMadeNotification(AddHumanMadeNotification model)
        {
            if (model.Type != NotificationTypes.Announcements && model.ItemId != 0)
            {
                bool isItemExists = await IsItemExists(model.Type , model.ItemId);

                if (!isItemExists)
                {
                    return new GetHumanMadeNotification
                    {
                        Key = ResponseKeys.NotFound.ToString()
                    };
                }
            }

            var usersIds = new List<string>();

            if (model.Audience == NotificationsAudience.Both)
            {
                var audience = new List<string> { "Student" , "Instructor"};

                usersIds = await _IBaseRepository.GetUsersIdsByRoles(audience);
            }
            else
            {
                usersIds = await _IBaseRepository.GetUsersIdsByRole(model.Audience.ToString()); 
            }

            var notification = new Models.Notifications
            {
                ItemId = model.ItemId > 0 ? model.ItemId : 0,
                Type = model.Type,
                Message = model.Message.Trim(),
                Date = _IBaseRepository.GetJordanTime(),
                Audience = model.Audience
            };

            await _IBaseRepository.AddAsync<Models.Notifications>(notification);

            var userNotifications = usersIds.Select(id => new UserNotifications
            {
              UserId = id,
              NotificationsId = notification.Id
            }).ToList();

            await _IBaseRepository.AddRangeAsync<UserNotifications>(userNotifications);

            foreach (var userId in usersIds)
            {
                await Notify("client", model.Message, userId);
            }

            return new GetHumanMadeNotification
            {
                Id = notification.Id,
                Audience = notification.Audience,
                ItemId = notification.ItemId,
                Message = notification.Message,
                Type = notification.Type,
                Key = ResponseKeys.Success.ToString()
            };

        }
        public async Task<List<GetHumanMadeNotifications>> GetHumanMadeNotifications()
        {
            return await _context.Notifications.OrderByDescending(n => n.Date).Select(n => new GetHumanMadeNotifications
            {
                Id = n.Id,
                Audience = n.Audience,
                ItemId = n.ItemId,
                Message = n.Message,
                Type = n.Type,
            }).ToListAsync();
        }
        public async Task<GetHumanMadeNotification> UpdateHumanMadeNotification(UpdateHumanMadeNotification model)
        {
            var notification = await _context.Notifications
                .Where(n => n.Id == model.Id)
                .FirstOrDefaultAsync();

            if (notification is null)
            {
                return new GetHumanMadeNotification
                {
                    Key = ResponseKeys.NotFound.ToString(),
                };
            }
            
            notification.Message = model.Message;
            notification.Date = _IBaseRepository.GetJordanTime();
            notification.Type = model.Type;
            notification.ItemId = model.ItemId;
            notification.Audience = model.Audience;

            _IBaseRepository.Update<Models.Notifications>(notification);

            var notificationUsers = await _context.UserNotifications
                .Where(notification => notification.Id == notification.Id)
                .ToListAsync();

            _IBaseRepository.RemoveRange<UserNotifications>(notificationUsers);

            var usersIds = new List<string>();

            if (notification.Audience == NotificationsAudience.Both)
            {
                var audience = new List<string> { "Student", "Instructor" };

                usersIds = await _IBaseRepository.GetUsersIdsByRoles(audience);
            }
            else
            {
                usersIds = await _IBaseRepository.GetUsersIdsByRole(model.Audience.ToString());
            }

            var userNotifications = usersIds.Select(id => new UserNotifications
            {
                UserId = id,
                NotificationsId = notification.Id
            }).ToList();

            await _IBaseRepository.AddRangeAsync<UserNotifications>(userNotifications);

            foreach (var userId in usersIds)
            {
                await Notify("client", model.Message, userId);
            }

            return new GetHumanMadeNotification
            {
                Id = notification.Id,
                Audience = notification.Audience,
                ItemId = notification.ItemId,
                Message = notification.Message,
                Type = notification.Type,
                Key = ResponseKeys.Success.ToString()
            };

        }
        public async Task<GetHumanMadeNotification> GetHumanMadeNotification(int notificationId)
        {
            var notification = await _context.Notifications
           .Where(n => n.Id == notificationId)
           .FirstOrDefaultAsync();

            if (notification is null)
            {
                return new GetHumanMadeNotification
                {
                    Key = ResponseKeys.NotFound.ToString(),
                };
            }

            return new GetHumanMadeNotification
            {
                Id = notification.Id,
                Audience = notification.Audience,
                ItemId = notification.ItemId,
                Message = notification.Message,
                Type = notification.Type,
                Key = ResponseKeys.Success.ToString()
            };
        }
        public async Task<bool> DeleteHumanMadeNotification(int notificationId)
        {
            var notification = await _context.Notifications
                .Where(n => n.Id == notificationId)
                .FirstOrDefaultAsync();

            if (notification is null)
            {
                return false;
            }
            _IBaseRepository.Remove<Models.Notifications>(notification);

            return true;
        }
        public async Task<List<GetNotifications>> GetUserNotifications(string userId) { 
            return await _context.UserNotifications
                .Include(un => un.Notifications)
                .Where(un => un.UserId == userId)
                .OrderByDescending(n => n.Notifications.Date)
                .Select(un => new GetNotifications
                {
                    Id = un.Id,
                    ItemId = un.Notifications.ItemId,
                    Type = un.Notifications.Type,
                    Message = un.Notifications.Message,
                    Date = un.Notifications.Date
                }).ToListAsync();
        }
        public async Task<bool> DeleteUserNotifications(string userId,List<int> NotificationsIds)
        {
            if (NotificationsIds == null)
            {
                return false;
            }

            var userNotifications = await _context.UserNotifications
                .Where(n => NotificationsIds.Contains(n.Id) && n.UserId == userId)
                .ToListAsync();

            return _IBaseRepository.RemoveRange<UserNotifications>(userNotifications);
        }
        private async Task<bool> IsItemExists(NotificationTypes type, int? itemId)
        {
            switch (type)
            {
                case NotificationTypes.Course:
                    return await _IBaseRepository.AnyByIdAsync<Course>(itemId);

                case NotificationTypes.Package:
                    return await _IBaseRepository.AnyByIdAsync<Package>(itemId);

                default:
                    return false;
            }
        }
        private async Task<string> GetLoggedInUserIdAsync()
        {
            var userIdClaim = _httpContextAccessor.HttpContext.User?.FindFirst("uid");

            return userIdClaim?.Value;
        }
        private async Task<List<string>> PermissionedAdmins(AdminNotifications type)
        {
            var adminsIds = await _IBaseRepository.GetAdminUsers();

            int viewPermissionId = await _context.Permissions
                .Where(p => p.Name == Enums.Permissions.View.ToString())
                .Select(p => p.Id)
                .FirstOrDefaultAsync();

            int pageId = 0;

            switch (type)
            {
                case AdminNotifications.Orders:

                    pageId =  await _context.Pages
                        .Where(p => p.Name == Pages.Orders.ToString())
                        .Select(p => p.Id)
                        .FirstOrDefaultAsync();
                    break;

                case AdminNotifications.ChangePasswordRequests:

                    pageId = await _context.Pages
                        .Where(p => p.Name == Pages.Password_Requests.ToString().Replace("_", " "))
                        .Select(p => p.Id)
                        .FirstOrDefaultAsync();

                    break;

                case AdminNotifications.Messages:

                    pageId = await _context.Pages
                        .Where(p => p.Name == Pages.Inbox.ToString())
                        .Select(p => p.Id)
                        .FirstOrDefaultAsync();

                    break;
            }

            var rolesWithViewPermission = await _context.PagePermissions
                .Where(pp => pp.PermissionsId == viewPermissionId && pp.PageId == pageId)
                .Select(pp => pp.RoleId)
                .ToListAsync();


            var usersWithRoles = await _context.UsersRoles
              .Where(ur => adminsIds.Contains(ur.UserId) && rolesWithViewPermission.Contains(ur.RoleId))
              .Select(ur => ur.UserId)
              .Distinct()
              .ToListAsync();

            return usersWithRoles;

        }
    }
}
