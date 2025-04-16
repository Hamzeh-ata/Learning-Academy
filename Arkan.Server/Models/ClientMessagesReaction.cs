namespace Arkan.Server.Models
{
    public class ClientMessagesReaction : BaseModel
    {
        public int ClientMessagesId { get; set; } 
        public ClientMessages ClientMessages {  get; set; }
        public string UserId { get; set; }
        public ApplicationUser User { get; set; }
        public string Emoji { get; set; }
    }
}
