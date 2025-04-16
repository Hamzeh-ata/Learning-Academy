namespace Arkan.Server.SupportChat_PageModels
{
    public class SendSupportMessage
    {
        public string Content { get; set; }
        public IFormFile? File { get; set; }
        public int? ChatRoomId { get; set; }
    }
}
