using Arkan.Server.Enums;

namespace Arkan.Server.PageModels.ArkanCodesModels
{
    public class AddArkanCode
    {
        public string Code { get; set; }
        public ArkanCodeTypes Type { get; set; }
        public int ItemId { get; set; }
        public double Discount { get; set; }
        public bool IsActive { get; set; }
        public int NumberTimesUsedAllowed { get; set; }
    }
}
