namespace Arkan.Server.PageModels.Payments
{
    public class GetOrderPayments
    {
        public int Id { get; set; }
        public double AmountPaid { get; set; }
        public DateTime PaymentDate { get; set; }
    }
    public class OrderPaymentsInfo
    {
        public double OrderAmount { get; set; }
        public double TotalPayments { get; set; }
        public double RemainingAmount { get; set; }
        public List<GetOrderPayments> Payments { get; set; }
    }
}
