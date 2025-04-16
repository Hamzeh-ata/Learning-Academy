using Arkan.Server.Client_PageModels.Packages;
using Arkan.Server.Helpers;

namespace Arkan.Server.Client_Interfaces
{
    public interface IClientPackages
    {
        Task<PaginationResult<GetPackages>> GetPackages(int pageNumber, int pageSize, string? name);
        Task<GetPackage> GetPackage(int packageId, string? userId);
    }
}
