using Arkan.Server.Client_PageModels.Courses;
using Arkan.Server.Helpers;
using Arkan.Server.PageModels.CourseModels;

namespace Arkan.Server.Client_Interfaces
{
    public interface IClientCourses
    {
        Task<PaginationResult<GetAllCourses>> GetAllCourses(int PageNumber, int PageSize);
        Task<GetCourse> GetCourse(int CourseId, string? UserId);
        Task<PaginationResult<GetAllCourses>> FilterCourses(ClientCourseFilterModel filters);
    }
}
