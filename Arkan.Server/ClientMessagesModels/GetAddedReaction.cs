namespace Arkan.Server.ClientMessagesModels
{
    public class GetAddedReaction
    {
        public int Id { get; set; } 
        public int MessageId { get; set; }
        public string Emoji {  get; set; }
        public string UserId { get; set; }
        public string UserName { get; set; }
        public string? UserImage { get; set; }
        public string Key { get; set; }
    }
}
