using Arkan.Server.Helpers;
using Arkan.Server.PageModels.PackageModels;

namespace Arkan.Server.Interfaces
{
    public interface IStudentPackagesInterface
    {
        Task<PaginationResult<StudentPackagesModel>> GetStudentPackages(string userId, int pageNumber, int pageSize);
        Task<PaginationResult<StudentPackagesModel>> GetNonStudentPackages(string userId, int pageNumber, int pageSize);
        Task<string> AddStudentPackages(AddStudentPackagesDto model);
        Task<string> RemoveStudentPackages(RemoveStudentPackagesDto model);

    }
}
