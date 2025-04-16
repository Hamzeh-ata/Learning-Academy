namespace Arkan.Server.Models
{
    public class SupportChatMessage : BaseModel
    {
        public string Content { get; set; }
        public int? SupportChatRoomId { get; set; }
        public SupportChatRoom SupportChatRoom { get; set; }
        public string? SenderUserId { get; set; }
        public string Role { get; set; }
        public string? FilePath { get; set; }
        public DateTime Timestamp { get; set; }
        public bool IsDeleted { get; set; }
    }
}
