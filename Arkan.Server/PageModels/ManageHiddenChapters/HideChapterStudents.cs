namespace Arkan.Server.PageModels.ManageHiddenChapters
{
    public class HideChapterStudents
    {
        public int ChapterId { get; set; }
        public int CourseId { get; set; }
        public List<string> UserIds { get; set; }
    }
}
