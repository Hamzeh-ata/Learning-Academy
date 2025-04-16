using Arkan.Server.PageModels.QuizModels;

namespace Arkan.Server.Interfaces
{
    public interface IQuestionInterface
    {
        Task<GetQuestion> AddQuestion(AddQuestionDto model);
        Task<GetUpdatedQuestion> UpdateQuestion(UpdateQuestionDto model);
        Task<string> DeleteQuestion(int QuestionId);
        Task<List<GetQuestions>> GetQuizQuestions(int QuizId);
    }
}
