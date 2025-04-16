namespace Arkan.Server.SupportChat_PageModels
{
    public class GetSupportMessage
    {
        public int Id { get; set; }
        public string Content { get; set; }
        public string? SenderId { get; set; }
        public string? SenderProfileImage { get; set; }
        public string SenderName { get; set; }
        public DateTime Timestamp { get; set; }
        public string? File { get; set; }
        public int? RoomId { get; set; }
        public string Key { get; set; }
    }
}
