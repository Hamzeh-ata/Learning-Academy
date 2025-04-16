namespace Arkan.Server.Models
{
    public class OrderPayments : BaseModel
    {
        public int OrderId { get; set; }
        public UserOrder Order { get; set; }
        public double AmountPaid { get; set; }
        public DateTime PaymentDate { get; set; }
    }
}
