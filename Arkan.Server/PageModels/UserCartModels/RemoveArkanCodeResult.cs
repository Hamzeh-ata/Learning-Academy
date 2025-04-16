namespace Arkan.Server.PageModels.UserCartModels
{
    public class RemoveArkanCodeResult
    {
        public int ItemId { get; set; }
        public double CartAmount { get; set; }
        public double Price { get; set; }
        public double DiscountPrice { get; set; }
        public string Key { get; set; }
    }
}
