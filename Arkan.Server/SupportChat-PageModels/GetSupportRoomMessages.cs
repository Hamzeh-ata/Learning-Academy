namespace Arkan.Server.SupportChat_PageModels
{
    public class GetSupportRoomMessages
    {
        public int? RoomId { get; set; }
        public int MessageId { get; set; }
        public string? SenderId {  get; set; }
        public string? SenderName {  get; set; }
        public string? SenderImage {  get; set; }
        public string Content { get; set; }
        public string? File { get; set; }
        public bool SentByClient { get; set; }
        public bool isOnline { get; set; }

        public DateTime Timestamp { get; set; }
    }
}
