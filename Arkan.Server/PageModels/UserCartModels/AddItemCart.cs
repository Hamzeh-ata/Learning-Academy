using Arkan.Server.Enums;

namespace Arkan.Server.PageModels.UserCartModels
{
    public class AddItemCart
    {
        public int ItemId {  get; set; }
        public ItemTypes Type { get; set; }
    }
}
