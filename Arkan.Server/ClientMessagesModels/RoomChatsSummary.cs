namespace Arkan.Server.ClientMessagesModels
{
    public class RoomChatsSummary
    {
        public int RoomId {  get; set; }
        public int CourseId { get; set; }
        public string? UserId { get; set; }
        public string? CourseName { get; set; }
        public string? SenderId { get; set; }
        public string? ReceiverId { get; set; }
        public string? CourseImage { get; set; }
        public string? LastMessageContent { get; set; }
        public string? LastMessageUserName { get; set; }
        public string? LastMessageUserImage { get; set; }
        public DateTime? LastMessageTimestamp { get; set; }
        public bool IsLastMessageSeen { get; set; }
        public int UsersCount { get; set; }
        public bool IsMuted { get; set; }
        public bool IsOnline { get; set; }

    }

}
