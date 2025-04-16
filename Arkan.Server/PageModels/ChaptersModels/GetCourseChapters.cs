namespace Arkan.Server.PageModels.ChaptersModels
{
    public class GetCourseChapters
    {
        public int Id { get; set; }
        public string Name { get; set;}
        public string Description { get; set; }
        public bool IsFree { get; set; }
        public int CourseId { get; set; }
        public int LessonsCount { get; set; }
        public string Key {  get; set; }
        public List<GetChapterLessons> Lessons { get; set; }
    }
}
