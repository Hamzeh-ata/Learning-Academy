namespace Arkan.Server.ClientMessagesModels
{
    public class AddClientMessages
    {
        public string Content { get; set; }
        public IFormFile? File { get; set; }
        public int? ParentMessageID { get; set; }
        public string? ReceiverID { get; set; }
        public int? ChatRoomId {  get; set; }
    }
}
