using Arkan.Server.Helpers;
using Arkan.Server.PageModels.PackageModels;

namespace Arkan.Server.Interfaces
{
    public interface IPackageInterface
    {
        Task<GetAddedPackage> AddPackage(AddPackageDto model,string userId);
        Task<GetUpdatedPackage> UpdatePackage(UpdatePackageDto model,string userId);
        Task<GetPackage> GetPackage(int packageId);
        Task<PaginationResult<GetPackages>> GetPackages(int pageNumber, int pageSize);
        Task<string> RemovePackage(int packageId);
    }
}
