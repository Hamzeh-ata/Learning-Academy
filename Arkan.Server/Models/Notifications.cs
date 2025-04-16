using Arkan.Server.Enums;

namespace Arkan.Server.Models
{
    public class Notifications : BaseModel
    {
        public int? ItemId { get; set; }
        public NotificationTypes Type { get; set; }
        public string Message {  get; set; }
        public DateTime Date { get; set; }
        public NotificationsAudience Audience { get; set; }
    }
}
