using Arkan.Server.Client_PageModels.Chapters;

namespace Arkan.Server.Client_PageModels.Lessons
{
    public class GetUpdatedLesson
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public bool IsFree { get; set; }
        public bool IsCompleted { get; set; }
        public string VideoUrl { get; set; }
        public string Material { get; set; }
        public LessonQuiz? Quiz { get; set; }
        public string Key { get; set; }
    }
}
