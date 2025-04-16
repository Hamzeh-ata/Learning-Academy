namespace Arkan.Server.PageModels.UserCartModels
{
    public class GetAddedItem
    {
        public int Id {  get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Type {  get; set; }
        public string Image { get; set; }
        public double Price {  get; set; }
        public double? DiscountPrice {  get; set; }
        public string Key {  get; set; }
    }
}
