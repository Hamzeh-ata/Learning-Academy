using Arkan.Server.Enums;

namespace Arkan.Server.Models
{
    public class UserCart : BaseModel
    {
        public string UserId { get; set; }
        public ApplicationUser User { get; set; }
        public int ItemId { get; set; }
        public ItemTypes Type { get; set; }
        // price or discount price or price after code
        public double Price { get; set; }
        public string? Code {  get; set; }
    }
}
