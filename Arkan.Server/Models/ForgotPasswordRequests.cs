namespace Arkan.Server.Models
{
    public class ForgotPasswordRequests : BaseModel
    {
        public string UserId { get; set; }
        public ApplicationUser User { get; set; }
        public string Password { get; set; }
        public DateTime RequestDate { get; set; }
    }
}
