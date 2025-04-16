using Arkan.Server.Enums;

namespace Arkan.Server.PageModels.ArkanCodesModels
{
    public class GetArkanCode
    {
        public int Id { get; set; }
        public string Code { get; set; }
        public ArkanCodeTypes Type { get; set; }
        public int ItemId { get; set; }
        public double Discount { get; set; }
        public bool IsActive { get; set; }
        public int NumberTimesUsedAllowed { get; set; }
        public string Key {  get; set; }
    }
}
