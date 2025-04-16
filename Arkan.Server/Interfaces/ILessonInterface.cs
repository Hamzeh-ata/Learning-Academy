using Arkan.Server.PageModels.LessonsModels;

namespace Arkan.Server.Interfaces
{
    public interface ILessonInterface
    {
        public  Task<List<GetLessonsDto>> GetChapterLessons(int ChapterId);
        public Task<LessonInfo> AddLesson(AddLesson model,string userId);
        public Task<LessonInfo> UpdateLesson(UpdateLesson model, string userId);
        public Task<string> DeleteLesson(int LessonId, string userId);
    }
}
