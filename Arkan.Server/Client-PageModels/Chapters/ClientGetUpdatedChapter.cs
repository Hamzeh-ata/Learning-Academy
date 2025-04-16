namespace Arkan.Server.Client_PageModels.Chapters
{
    public class ClientGetUpdatedChapter
    {
        public int Id { get; set; }
        public int LessonsCount { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Key { get; set; }
        public bool IsFree { get; set; }
        public List<GetLessonsWithQuiz> Lessons { get; set; }

    }
}
