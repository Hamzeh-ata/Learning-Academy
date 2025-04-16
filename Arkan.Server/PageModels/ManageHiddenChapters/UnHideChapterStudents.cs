namespace Arkan.Server.PageModels.ManageHiddenChapters
{
    public class UnHideChapterStudents
    {
        public int ChapterId { get; set; }
        public int CourseId { get; set; }
        public List<string> UserIds { get; set; }
    }
}
