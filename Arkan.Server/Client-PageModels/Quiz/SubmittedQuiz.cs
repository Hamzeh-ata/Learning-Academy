namespace Arkan.Server.Client_PageModels.Quiz
{
    public class SubmittedQuiz
    {
        public int QuizId { get; set; }
        public string QuizName { get; set;}
        public double QuizTotalPoints { get; set; }
        public int QuestionsCount { get; set; }
        public int AnsweredQuestionsCount {  get; set; }
        public int CorrectAnswersCount {  get; set; }
        public int WrongAnswersCount { get; set; }
        public double StudentTotalPoints { get; set; }
        public string TimeTaken { get; set; }
        public string Key { get; set; }

    }
}
