namespace Arkan.Server.ClientMessagesModels
{
    public class ClientChatSummary
    {
        public int RoomId {  get; set; }
        public string LastMessageUserName { get; set; }
        public string LastMessageUserImage { get; set; }
        public string LastMessage { get; set; }
        public string SenderName { get; set; }
        public string SenderId { get; set; }
        public string? SenderImage { get; set; }
        public DateTime LastMessageTimestamp { get; set; }
        public bool IsLastMessageSeen { get; set; }
        public bool IsOnline { get; set; }

    }
}
