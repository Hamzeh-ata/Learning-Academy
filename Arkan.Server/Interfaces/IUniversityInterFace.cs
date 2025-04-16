using Arkan.Server.Helpers;
using Arkan.Server.PageModels.UnviersitesModels;

namespace Arkan.Server.Interfaces
{
    public interface IUniversityInterFace
    {
        Task<GetAddedUnviersity> AddUniversity(AddUnvierstyDto model);
        Task<GetUpdatedUnviersty> UpdateUniversity(UpdateUnvierstyDto model);
        Task<string> RemoveUniversity(int unvierstyId);
        Task<PaginationResult<GetUnviersties>> GetUniversities(int pageNumber, int pageSize);
        Task<GetUnviersty> GetUniversity(int unvierstyId);
    }
}
