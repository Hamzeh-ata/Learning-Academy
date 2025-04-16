namespace Arkan.Server.ClientMessagesModels
{
    public class UpdateReaction
    {
        public int Id { get; set; }
        public int MessagesId { get; set; }
        public string Emoji { get; set; }
    }
}
