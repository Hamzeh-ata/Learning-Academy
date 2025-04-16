using Arkan.Server.PageModels.UserCartModels;

namespace Arkan.Server.Client_Interfaces
{
    public interface IUserCart
    {
        Task<GetAddedItem> AddUserCart(AddItemCart model, string userId);
        Task<GetUserCart> GetUserCart(string userId);
        Task<string> DeleteItem(string userId, int itemId);
        Task<ArkanCodeResult> AddArkanCode(string userId, int itemId, string code);
        Task<RemoveArkanCodeResult> RemoveArkanCode(string userId, int itemId);
    }

}
