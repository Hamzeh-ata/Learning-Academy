namespace Arkan.Server.Client_PageModels.Quiz
{
    public class GetQuiz
    {
        public string QuizName { get; set; }
        public string LessonName { get; set; }
        public int QuizId { get; set; }
        public double? TimeLimit { get; set; }
        public List<QuizQuestions> Questions { get; set; }
        public string Key {  get; set; }
    }

    public class QuizQuestions
    {
        public int Id { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? Image { get; set; }
        public double Points { get; set; }
        public List<QuestionAnswers> Answers {  get; set; }
    }

    public class QuestionAnswers
    {
        public int Id { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? Image { get; set; }
        public bool IsCorrect { get; set; }
    }

}
