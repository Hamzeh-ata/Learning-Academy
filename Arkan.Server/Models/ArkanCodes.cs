using Arkan.Server.Enums;

namespace Arkan.Server.Models
{
    public class ArkanCodes: BaseModel
    {
        public string Code {  get; set; }
        public ArkanCodeTypes Type { get; set; }
        public int ItemId {  get; set; }
        public double Discount { get; set; }
        public bool IsActive {  get; set; }
        public int NumberTimesUsedAllowed {  get; set; }
        public string? CreatedBy { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? ModifiedAt { get; set; }
        public string? ModifiedBy { get; set; }
    }
}
