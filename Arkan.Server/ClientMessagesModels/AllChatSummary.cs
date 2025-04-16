using Arkan.Server.Enums;

namespace Arkan.Server.ClientMessagesModels
{
    public class AllChatSummary
    {
        public int RoomId { get; set; }
        public string LastMessageUserName { get; set; }
        public string LastMessageUserImage { get; set; }
        public string LastMessage { get; set; }
        public DateTime LastMessageTimestamp { get; set; }
        public bool IsLastMessageSeen { get; set; }
        public ChatTypes ChatType { get; set; }
    }
}
