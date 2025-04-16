namespace Arkan.Server.ClientMessagesModels
{
    public class GetSentRoomMessage
    {
        public int Id { get; set; }
        public string Content { get; set; }
        public string SenderId { get; set; }
        public string SenderName { get; set; }
        public string? SenderProfileImage { get; set; }
        public int? ParentMessageID { get; set; }
        public DateTime Timestamp { get; set; }
        public string? File { get; set; }
        public int ChatRoomId { get; set; }
        public int CourseId { get; set; }
        public string Key { get; set; }
    }
}
