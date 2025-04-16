using Arkan.Server.Enums;

namespace Arkan.Server.Client_PageModels.UserOrders
{
    public class AddOrderItems
    {
        public int OrderId { get; set;}
        public int ItemId {  get; set;}
        public ItemTypes Type { get; set;}
        public double Price { get; set;}    

    }
}
