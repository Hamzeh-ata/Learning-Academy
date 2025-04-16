namespace Arkan.Server.Models
{
    public class UserNotifications : BaseModel
    {
        public string UserId { get; set; }
        public ApplicationUser User { get; set; }
        public int NotificationsId { get; set; }
        public Notifications Notifications { get; set; }

    }
}
