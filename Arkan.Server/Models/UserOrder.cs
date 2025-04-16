namespace Arkan.Server.Models
{
    public class UserOrder : BaseModel
    {
        public string UserId { get; set; }
        public ApplicationUser User { get; set; }
        public DateTime OrderDate { get; set; }
        public bool IsConfirmed {  get; set; }
        public double Amount {  get; set; }
        public double DiscountAmount { get; set; }
        public string? PromoCode {  get; set; }
        public string ? ConfirmedBy { get; set; }
        public DateTime ? ConfirmedDate {  get; set; }
        public ICollection<OrderItems> OrderItems { get; set; }

    }
}
