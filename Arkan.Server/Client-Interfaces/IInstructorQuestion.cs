using Arkan.Server.PageModels.QuizModels;

namespace Arkan.Server.Client_Interfaces
{
    public interface IInstructorQuestion
    {
        Task<GetQuestion> AddQuestion(AddQuestionDto model, string userId);
        Task<GetQuestion> GetQuestion(int QuestionId, string userId);
        Task<GetUpdatedQuestion> UpdateQuestion(UpdateQuestionDto model, string userId);
        Task<string> DeleteQuestion(int QuestionId, string userId);
        Task<List<GetQuestions>> GetQuizQuestions(int QuizId, string userId);
    }
}
