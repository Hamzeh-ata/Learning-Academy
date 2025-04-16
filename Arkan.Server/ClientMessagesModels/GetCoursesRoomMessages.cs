namespace Arkan.Server.ClientMessagesModels
{
    public class GetCoursesRoomMessages
    {
        public int Id { get; set; }
        public string Content { get; set; }
        public string? File { get; set; }
        public string SenderId { get; set; }
        public string SenderName { get; set; }
        public string? SenderProfileImage { get; set; }
        public DateTime Timestamp { get; set; }
        public bool IsSenderCurrentUser {  get; set; }
        public int? ParentMessageID { get; set; }
        public bool IsDeleted { get; set; }
        public bool isMuted {  get; set; }
        public List<RoomMessageReaction>? Reactions { get; set; }
    }

    public class RoomMessageReaction
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public string? UserImage { get; set; }
        public string UserName { get; set; }
        public string Emoji { get; set; }
    }

}
