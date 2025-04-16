namespace Arkan.Server.SupportChat_PageModels
{
    public class SupportChatSummary
    {
        public int RoomId { get; set; }
        public string LastMessageUserName { get; set; }
        public string LastMessageUserImage { get; set; }
        public string LastMessage { get; set; }
        public DateTime LastMessageTimestamp { get; set; }
    }
}
