using Arkan.Server.PageModels.FrequentlyQuestions;

namespace Arkan.Server.Interfaces
{
    public interface IFrequentlyQuestions
    {
        Task<GetFrequentlyQuestion> AddQuestion(string title,string answer);
        Task<GetFrequentlyQuestion> UpdateQuestion(int id, string title, string answer);
        Task<string> DeleteQuestion(int id);
        Task<GetFrequentlyQuestion> GetQuestionById(int id);
        Task<List<GetFrequentlyQuestion>> GetAllQuestions();

    }
}