using Arkan.Server.Client_PageModels.Chapters;

namespace Arkan.Server.Client_Interfaces
{
    public interface IClientChapters
    {
        Task<List<ClientGetChapters>> GetChapters(int courseId, string? userId);
        Task<string> LessonCompleted(int lessonId, string userId);
    }
}
