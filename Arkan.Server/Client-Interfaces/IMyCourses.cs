using Arkan.Server.Client_PageModels.MyCourses;
using Arkan.Server.Helpers;

namespace Arkan.Server.Client_Interfaces
{
    public interface IMyCourses
    {
        Task<PaginationResult<GetMyCourses>> GetUserCourses(string userId, int pageNumber, int pageSize);
    }
}
