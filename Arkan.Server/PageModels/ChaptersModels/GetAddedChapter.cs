namespace Arkan.Server.PageModels.ChaptersModels
{
    public class GetAddedChapter
    {
        public int Id { get; set; }
        public int CourseId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Key { get; set; }
        public bool IsFree { get; set; }
    }
}
