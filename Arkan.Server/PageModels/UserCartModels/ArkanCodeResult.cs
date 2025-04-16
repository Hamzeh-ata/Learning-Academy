namespace Arkan.Server.PageModels.UserCartModels
{
    public class ArkanCodeResult
    {
        public int ItemId {  get; set; }
        public string? ArkanCode { get; set; }
        public double CartAmount { get; set; }
        public double Price {  get; set; }
        public double DiscountPrice { get; set; }
        public double ItemCodePrice {  get; set; }
        public string Key {  get; set; }
    }
}
