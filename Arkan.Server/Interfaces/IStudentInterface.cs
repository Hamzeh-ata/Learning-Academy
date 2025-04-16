using Arkan.Server.Helpers;
using Arkan.Server.Models;
using Arkan.Server.PageModels.CourseModels;
using Arkan.Server.PageModels.StudentModels;
using Arkan.Server.StudentModels;

namespace Arkan.Server.Interfaces
{
    public interface IStudentInterface
    {
        Task<PaginationResult<GetCoursesMainInfo>> GetStudentCourses(int pageNumber, int pageSize, string UserID);
        Task<StudentAuth> AddStudentInfoAsync(StudentInformation studentInformation);
        Task<StudentAuth> UpdateStudentInfoAsync(StudentInformation studentInformation);
        Task<string> DeleteStudent(string UserID, string currentUserId);
        Task<string> ChangeStudentPassword(ChangePasswordAdminForm model,string currentUserId);
        Task<string> AddCoursesToStudent(AddCoursesToStudent model);
        Task<string> RemoveStudentFromCourses(RemoveStudentFromCourses model);
        Task<PaginationResult<GetCoursesMainInfo>> GetCoursesNotEnrolledByStudent(int pageNumber, int pageSize, string UserId);
        Task<AllStudentInformation> GetStudentInfoAsync(string userId);
        Task<PaginationResult<StudentMainInfo>> GetAll(int pageNumber, int pageSize);
        Task<List<GetCoursesMainInfo>> FilterStudentNonEnrollCourses(string Name, string UserId);
        Task<List<GetCoursesMainInfo>> FilterStudentCourses(string Name, string UserId);
    }
}
