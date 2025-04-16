using Arkan.Server.PageModels.ArkanCodesModels;

namespace Arkan.Server.Interfaces
{
    public interface IArkanCode
    {
        Task<GetArkanCode> AddArkanCode(AddArkanCode model);
        Task<GetArkanCode> UpdateArkanCode(UpdateArkanCode model);
        Task<GetArkanCode> GetArkanCode(int Id);
        Task<string> RemoveArkanCode(int Id);
        Task<List<GetArkanCodes>> GetArkanCodes();
        Task<string> GenerateNumber();
    }
}
