using System.ComponentModel.DataAnnotations;

namespace Arkan.Server.PageModels.Payments
{
    public class AddPayment
    {
        [Required]
        public int OrderId {  get; set; }
        [Required]
        public double AmountPaid { get; set; }

    }
}
