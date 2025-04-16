namespace Arkan.Server.PageModels.QuizModels
{
    public class GetQuiz
    {
        public int Id { get; set; }
        public int LessonId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public double? TimeLimit { get; set; }
        public bool IsRequired { get; set; }
        public bool IsRandomized { get; set; }
        public double TotalMarks { get; set; }
        public string Key { get; set; }
        public List<GetQuizQuestion> Questions { get; set; }

    }
}
