using Arkan.Server.Helpers;
using Arkan.Server.Models;
using Arkan.Server.PageModels.CourseModels;

namespace Arkan.Server.Interfaces
{
    public interface ICourseInterface
    {
        Task<GetCourseInfo> AddCourseAsync(AddCourseModel model,string userId);
        Task<GetCourseInfo> UpdateCourseAsync(UpdateCourseModel model, string userId);
        Task<string> RemoveCourseAsync(int CourseId, string userId);
        Task<PaginationResult<GetEnrolledStudents>> GetEnrolledStudents(int pageNumber, int pageSize, int CourseId);
        Task<PaginationResult<GetCoursesMainInfo>> GetPaginatedEntitiesAsync(int pageNumber, int pageSize);
        Task<PaginationResult<GetCoursesMainInfo>> FilterCoursesByName(int pageNumber, int pageSize, string Name);
        Task<string> RemoveStudentsFromCourse(RemoveCourseStudentsDto model);
        Task<GetCourseInfo> GetCourseById(int courseId);
        Task<PaginationResult<GetFilteredCourses>> FilterCourses(CourseFilterModel filters);

    }
}
