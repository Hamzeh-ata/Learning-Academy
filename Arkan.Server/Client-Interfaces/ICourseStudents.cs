using Arkan.Server.Client_PageModels.CourseStudents;
using Arkan.Server.Helpers;

namespace Arkan.Server.Client_Interfaces
{
    public interface ICourseStudents
    {
        Task<PaginationResult<CourseStudents>> GetCourseStudents(GetCourseStudents model,string userId);
    }
}
