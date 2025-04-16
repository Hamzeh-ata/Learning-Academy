using Arkan.Server.Enums;
using System.ComponentModel.DataAnnotations;

namespace Arkan.Server.PageModels.NotificationModels
{
    public class AddHumanMadeNotification
    {
        [Required]
        public string Message { get; set; }
        [Required]
        public NotificationsAudience Audience { get; set; }
        public NotificationTypes Type { get; set; }
        public int? ItemId {  get; set; }
    }
}
