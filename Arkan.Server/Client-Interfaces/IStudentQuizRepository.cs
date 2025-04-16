using Arkan.Server.Client_PageModels.Quiz;

namespace Arkan.Server.Client_Interfaces
{
    public interface IStudentQuizRepository
    {
        Task<GetQuiz> StartQuiz(int lessonId, string userId);
        Task<string> RemoveAttempet(int quizId, string userId);
        Task<string> SubmitAnswer(SubmitAnswer model, string userId);
        Task<SubmittedQuiz> FinishQuiz(int quizId, string userId);
        Task<QuizReview> QuizReview(int quizId, string userId);
    }
}
