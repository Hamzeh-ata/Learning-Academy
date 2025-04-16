using Arkan.Server.Client_PageModels.Quiz;
using Arkan.Server.Helpers;

namespace Arkan.Server.Interfaces
{
    public interface IQuizStudentsAttempts
    {
        Task<PaginationResult<StudentAttempts>> GetStudentsAttempts(GetStudentsAttempt model);
    }
}
