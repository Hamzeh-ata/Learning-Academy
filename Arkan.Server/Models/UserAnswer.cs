namespace Arkan.Server.Models
{
    public class UserAnswer : BaseModel
    {
        public int UserQuizAttemptId { get; set; }
        public UserQuizAttempt UserQuizAttempt { get; set; }
        public int QuestionId { get; set; }
        public Question Question { get; set; }
        public int? AnswerId { get; set; }
        public Answer Answer { get; set; }
        public string? UserResponse { get; set; }
        // when the answer was submitted
        public DateTime SubmissionTime { get; set; } 
    }
}
