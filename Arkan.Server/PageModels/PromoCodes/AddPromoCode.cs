using Arkan.Server.Enums;

namespace Arkan.Server.PageModels.PromoCodes
{
    public class AddPromoCode
    {
        public string Code { get; set; }
        public PromoTypes Type { get; set; }
        public double Discount { get; set; }
        public bool IsActive { get; set; }
        public double ThresholdValue { get; set; }
    }
}
