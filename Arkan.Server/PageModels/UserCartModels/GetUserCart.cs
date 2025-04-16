namespace Arkan.Server.PageModels.UserCartModels
{
    public class GetUserCart
    {
        public double? Amount { get; set; }
        public List<ItemDetails> Items { get; set; }
    }

    public class ItemDetails
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Type { get; set; }
        public string Image { get; set; }
        public double Price { get; set; }
        public double? DiscountPrice { get; set; }
        public double? ItemCodePrice { get; set; }
        public string? ArkanCode {  get; set; }
    }
}
