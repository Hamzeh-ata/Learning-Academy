namespace Arkan.Server.Models
{
    public class AdminActivity : BaseModel
    {
        public string UserId { get; set; }
        public ApplicationUser User { get; set; }
        public DateTime DateTime { get; set; }
        public string Action { get; set; }
        public string ItemType { get; set; }
        public string ItemName { get; set; }

    }
}
