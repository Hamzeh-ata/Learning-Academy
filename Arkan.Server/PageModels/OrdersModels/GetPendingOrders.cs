using Arkan.Server.Enums;

namespace Arkan.Server.PageModels.OrdersModels
{
    public class GetPendingOrders
    {
        public int Id { get; set; }
        public string UserName { get; set; }
        public string UserPhone { get; set; }
        public DateTime OrderDate { get; set; }
        public double Amount { get; set; }
        public double DiscountAmount { get; set; }
        public string? PromoCode { get; set; }
        public List<OrdersItems> Items {  get; set; }

    }
    public class OrdersItems
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }
        public double Price { get; set; }
        public string? Code { get; set; }

    }
}
