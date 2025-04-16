namespace Arkan.Server.PageModels.OrdersModels
{
    public class GetConfirmedOrders
    {
        public int Id { get; set; }
        public string UserName { get; set; }
        public string UserPhone { get; set; }
        public DateTime OrderDate { get; set; }
        public double Amount { get; set; }
        public double DiscountAmount { get; set; }
        public string? PromoCode { get; set; }
        public double TotalPayments {  get; set; }
        public double RemainingAmount {  get; set; }
        public List<OrdersItems> Items { get; set; }
    }
}
