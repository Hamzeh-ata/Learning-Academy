using Arkan.Server.Client_PageModels.Instrctors;
using Arkan.Server.Client_PageModels.Instructors;
using Arkan.Server.Helpers;

namespace Arkan.Server.Client_Interfaces
{
    public interface IInstructors
    {
        Task<PaginationResult<GetAllInstrcutors>> GetAllInstructors(int pageNumber, int pageSize,string name);
        Task<PaginationResult<InstructorCourses>> GetInstructorCourses(string userId, int pageNumber, int pageSize);
    }
}
