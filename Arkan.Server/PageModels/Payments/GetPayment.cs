namespace Arkan.Server.PageModels.Payments
{
    public class GetPayment
    {
        public int Id { get; set; }
        public double AmountPaid { get; set; }
        public DateTime PaymentDate {  get; set; }
        public string Key {  get; set; }
    }
}
