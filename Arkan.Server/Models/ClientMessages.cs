using SendGrid.Helpers.Mail;
using System.Diagnostics.CodeAnalysis;

namespace Arkan.Server.Models
{
    public class ClientMessages : BaseModel
    {
        public int ClientChatRoomId { get; set; }
        public ClientChatRoom ClientChatRoom { get; set; }
        public string Content { get; set; }
        public string SenderID { get; set; }
        public string ReceiverID { get; set; }
        public string? FilePath { get; set; }
        public DateTime Timestamp { get; set; }
        public bool IsDeleted { get; set; }
        public int? ParentMessageID { get; set; } 
        public ClientMessages ParentMessage { get; set; }
        public ICollection<ClientMessagesReaction>? Reactions { get; set; }
        public string? DeletedByUserId {  get; set; }
    }
}
