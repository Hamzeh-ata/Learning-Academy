using Arkan.Server.Client_PageModels.InstructorQuiz;
using Arkan.Server.PageModels.QuizModels;

namespace Arkan.Server.Client_Interfaces
{
    public interface IInstructorQuiz
    {
        Task<ClientGetAddedQuiz> AddQuiz(ClientAddQuiz model, string userId);
        Task<ClientGetAddedQuiz> UpdateQuiz(ClientUpdateQuiz model, string userId);
        Task<string> RemoveQuiz(int QuizId, string userId);
        Task<GetQuiz> GetQuiz(int LessonId, string userId);
    }
}
