using Arkan.Server.Enums;

namespace Arkan.Server.Models
{
    public class PromoCodes : BaseModel
    {
        public string Code { get; set; }
        public PromoTypes Type {  get; set; }
        public double Discount { get; set; }
        public bool IsActive { get; set; }
        public int NumberOfTimeUsed {  get; set; }
        public double ThresholdValue { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? ModifiedAt { get; set; }
        public string? ModifiedBy { get; set; }
    }
}
