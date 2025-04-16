namespace Arkan.Server.Client_PageModels.Quiz
{
    public class StudentAttempts
    {
        public int Id {  get; set; }
        public string StudentName { get; set; }
        public DateTime AttemptDate { get; set; }
        public string StudentMark { get; set; }
        public string TimeTaken { get; set; }
        public List<QuestionsReview> Questions { get; set; }
    }

    public class QuizAttempts
    {
        public int Id { get; set; }
        public string QuizName { get; set; }
        public double QuizTotalPoints { get; set; }
        public StudentAttempts Attempts { get;set; }
    }

}


