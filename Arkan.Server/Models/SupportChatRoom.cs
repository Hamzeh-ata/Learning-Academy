namespace Arkan.Server.Models
{
    public class SupportChatRoom : BaseModel
    {
        public string? ClientSideUserId {  get; set; }
        public DateTime StartDate { get; set; }
    }
}
