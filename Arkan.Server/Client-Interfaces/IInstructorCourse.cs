
using Arkan.Server.Client_PageModels.Chapters;
using Arkan.Server.Client_PageModels.Lessons;

namespace Arkan.Server.Client_Interfaces
{
    public interface IInstructorCourse
    {
        Task<List<GetLessonsWithQuiz>> GetChapterLessons(int chapterId);
        Task<ClientGetAddedChapter> AddChapterAsync(ClientAddChapter model, string userId);
        Task<ClientGetUpdatedChapter> UpdateChapterAsync(ClientUpdateChapter model, string userId);
        Task<string> DeleteChapterAsync(int ChapterId, string userId);
        Task<GetAddedLesson> AddLesson(AddLesson model, string userId);
        Task<GetUpdatedLesson> UpdateLesson(UpdateLesson model, string userId);
        Task<string> DeleteLesson(int LessonId, string userId);
    }
}
