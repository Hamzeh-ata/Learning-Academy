using Arkan.Server.Client_PageModels.Quiz;
using Arkan.Server.Helpers;

namespace Arkan.Server.Client_Interfaces
{
    public interface IInstructorQuizReview
    {
        Task<PaginationResult<QuizAttempts>> GetStudentsAttempts(GetStudentsAttempt model, string userId);
    }
}
