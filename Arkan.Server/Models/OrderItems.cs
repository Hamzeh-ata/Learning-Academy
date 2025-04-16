using Arkan.Server.Enums;

namespace Arkan.Server.Models
{
    public class OrderItems : BaseModel
    {
        public int UserOrderId { get; set; }
        public UserOrder UserOrder {  get; set; }
        public int ItemId {  get; set; }
        public ItemTypes Type { get; set; }
        public double Price {  get; set; }
        public string? Code { get; set; }
    }
}
