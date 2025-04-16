namespace Arkan.Server.PageModels.LessonsModels
{
    public class LessonInfo
    {
        public int Id { get; set; }
        public int ChapterId {  get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string VideoUrl { get; set; }
        public bool IsFree { get; set; }
        public string Material { get; set; }
        public string Key {  get; set; }

    }

}
