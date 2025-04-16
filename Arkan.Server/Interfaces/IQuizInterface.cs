using Arkan.Server.PageModels.QuizModels;

namespace Arkan.Server.Interfaces
{
    public interface IQuizInterface
    {
        Task<GetAddedQuiz> AddQuiz(AddQuizDto model);
        Task<GetAddedQuiz> UpdateQuiz(UpdateQuizDto model);
        Task<GetQuiz> GetQuiz(int LessonId);
        Task<string> RemoveQuiz(int QuizId);
        Task<bool> IsRandomized(int QuizId);
        Task<int> GetQuizId(int LessonId);
    }
}
