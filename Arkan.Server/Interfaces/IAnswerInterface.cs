using Arkan.Server.PageModels.QuizModels;

namespace Arkan.Server.Interfaces
{
    public interface IAnswerInterface
    {
        Task<GetAnswer> AddAnswer(AddAnswersDto model);
        Task<GetAnswer> UpdateAnswer(UpdateAnswer model);
        Task<List<GetAnswers>> GetQuestionAnswers(int QuestionId);
        Task<string> DeleteAnswer(int AnswerId);
    }
}
