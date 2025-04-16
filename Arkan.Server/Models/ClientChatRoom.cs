namespace Arkan.Server.Models
{
    public class ClientChatRoom : BaseModel
    {
        public DateTime DateCreated { get; set; }
        public string Participant1Id { get; set; }
        public string Participant2Id { get; set; }
        public string? DeletedByUserId { get; set; }
    }
}
