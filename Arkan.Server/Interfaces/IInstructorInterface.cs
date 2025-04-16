using Arkan.Server.Helpers;
using Arkan.Server.Models;
using Arkan.Server.PageModels.CourseModels;
using Arkan.Server.PageModels.InstructorModels;
using Arkan.Server.StudentModels;
using System.Threading.Tasks;

namespace Arkan.Server.Interfaces
{
    public interface IInstructorInterface
    {
        //Task<List<InstructorMainInfo>> GetAll();
        Task<InstructorInformaition> GetInstructorInformationAsync(string UserId);
        Task<InstructorInformaition> AddInstructorInformationAsync(InstructorInformaitionDto model);
        Task<InstructorInformaition> UpdateInstructorInformationAsync(InstructorInformaitionDto model);
        Task<string> DeleteInstructor(string UserID);
        Task<string> AddCoursesToInstructor(InstructorCoursesManage model);
        Task<string> RemoveCoursesFromInstructor(InstructorCoursesManage model);
        Task<string> ChangeInstructorPassword(ChangePasswordAdminForm model);
        Task<PaginationResult<GetCoursesMainInfo>> CoursesNotTaughtByInstructor(int pageNumber, int pageSize, string UserId);
        Task<PaginationResult<GetCoursesMainInfo>> InstructorCourses(int pageNumber, int pageSize, string UserId);
        Task<PaginationResult<InstructorMainInfo>> GetAll(int pageNumber, int pageSize);
        Task<List<GetCoursesMainInfo>> FilterCoursesNotTaughtByInstructor(string Name, string UserId);
        Task<List<GetCoursesMainInfo>> FilterInstructorCourses(string Name, string UserId);
    }
}
