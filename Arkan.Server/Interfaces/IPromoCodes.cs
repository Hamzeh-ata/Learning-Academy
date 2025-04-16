using Arkan.Server.PageModels.PromoCodes;

namespace Arkan.Server.Interfaces
{
    public interface IPromoCodes
    {
        Task<GetPromoCode> AddPromoCode(AddPromoCode model);
        Task<GetPromoCode> GetPromoCode(int id);
        Task<GetPromoCode> UpdatePromoCode(UpdatePromoCode model);
        Task<string> RemovePromoCode(int id);
        Task<List<GetPromoCodes>> GetPromoCodes();
        Task<PromoCodeResult> CheckPromoCode(string code, double orderAmount, string userId);
    }
}
