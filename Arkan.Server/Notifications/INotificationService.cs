using Arkan.Server.Enums;
using Arkan.Server.PageModels.NotificationModels;

namespace Arkan.Server.Notifications
{
    public interface INotificationService
    {
        Task Notify(string topic, string notificationMessage, string userId);
        Task<GetHumanMadeNotification> AddHumanMadeNotification(AddHumanMadeNotification model);
        Task<List<GetHumanMadeNotifications>> GetHumanMadeNotifications();
        Task<GetHumanMadeNotification> UpdateHumanMadeNotification(UpdateHumanMadeNotification model);
        Task<GetHumanMadeNotification> GetHumanMadeNotification(int notificationId);
        Task<bool> DeleteHumanMadeNotification(int notificationId);
        Task<List<GetNotifications>> GetUserNotifications(string userId);
        Task<bool> DeleteUserNotifications(string userId,List<int> NotificationsIds);
        Task NotifyAdmin(string topic, string notificationMessage, AdminNotifications type);
    }
}
