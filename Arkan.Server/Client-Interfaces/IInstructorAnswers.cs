using Arkan.Server.PageModels.QuizModels;

namespace Arkan.Server.Client_Interfaces
{
    public interface IInstructorAnswers
    {
        Task<GetAnswer> AddAnswer(AddAnswersDto model);
        Task<GetAnswer> UpdateAnswer(UpdateAnswer model);
        Task<string> DeleteAnswer(int AnswerId);
        Task<List<GetAnswers>> GetQuestionAnswers(int QuestionId);
    }
}
