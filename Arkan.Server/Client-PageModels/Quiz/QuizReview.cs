namespace Arkan.Server.Client_PageModels.Quiz
{
    public class QuizReview
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public double QuizTotalPoints { get; set; }
        public double StudentMark { get; set; }
        public string TimeTaken { get; set; }
        public List<QuestionsReview> Questions { get; set; }
        public string Key { get; set; }

    }
    public class QuestionsReview
    {
        public int Id { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? Image { get; set; }
        public double Points { get; set; }
        public List<AnswersReview> Answers { get; set; }
    }
    public class AnswersReview
    {
        public int Id { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? Image { get; set; }
        public bool IsCorrect { get; set; }
        public bool IsSelected { get; set; }
    }





}
