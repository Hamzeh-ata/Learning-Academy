namespace Arkan.Server.ClientMessagesModels
{
    public class SendRoomMessage
    {
        public int CourseId { get; set; }
        public string Content { get; set; }
        public IFormFile? File { get; set; }
        public int? ParentMessageID { get; set; }

    }
}
