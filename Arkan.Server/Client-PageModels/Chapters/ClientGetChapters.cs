namespace Arkan.Server.Client_PageModels.Chapters
{
    public class ClientGetChapters
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public bool IsFree { get; set; }
        public List<GetChapterLessons> Lessons { get; set; }

    }

    public class GetChapterLessons
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public bool IsFree { get; set; }
        public bool IsCompleted { get; set; }
        public string VideoUrl { get; set; }
        public string Material { get; set; }
        public LessonQuiz? Quiz {  get; set; }
    }

    public class LessonQuiz {

        public int Id { get; set; }
        public string Name { get; set; }
        public string? Description { get; set; }
        public double? TimeLimit { get; set; }
        public bool IsRequierd { get; set; }
        public bool AllowAttempt { get; set; }
        public bool IsReviewAble {  get; set; }
        public double TotalMarks { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }

    }
}