namespace Arkan.Server.ClientMessagesModels
{
    public class GetAddedClientMessage
    {
        public int Id { get; set; }
        public string Content { get; set; }
        public string SenderID { get; set; }
        public string ReceiverID { get; set; }
        public string? SenderProfileImage {  get; set; }
        public string SenderName { get; set; }
        public int? ParentMessageID { get; set; }
        public DateTime Timestamp { get; set; }
        public string? File { get; set; }
        public int ChatRoomId {  get; set; }
        public string Key {  get; set; }

    }
}
