using Arkan.Server.Enums;

namespace Arkan.Server.PageModels.NotificationModels
{
    public class GetNotifications
    {
        public int Id { get; set; }
        public int? ItemId { get; set; }
        public NotificationTypes Type { get; set; }
        public string Message { get; set; }
        public DateTime Date { get; set; }
    }
}
