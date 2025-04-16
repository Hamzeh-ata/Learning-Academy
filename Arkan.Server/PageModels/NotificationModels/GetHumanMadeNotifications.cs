using Arkan.Server.Enums;

namespace Arkan.Server.PageModels.NotificationModels
{
    public class GetHumanMadeNotifications
    {
        public int Id { get; set; }
        public string Message { get; set; }
        public NotificationsAudience Audience { get; set; }
        public NotificationTypes Type { get; set; }
        public int? ItemId { get; set; }
    }
}
