using Arkan.Server.Enums;

namespace Arkan.Server.Models
{
    public class UserSeenMessages : BaseModel
    {
        public string UserId {  get; set; }
        public ApplicationUser User { get; set; }
        public int RoomId {  get; set; }
        public int LastMessageId {  get; set; }
        public ChatTypes Type { get; set; }
        public DateTime SeenAt { get; set; }
    }
}
