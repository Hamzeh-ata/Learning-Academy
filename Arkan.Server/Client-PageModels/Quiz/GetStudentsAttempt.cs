namespace Arkan.Server.Client_PageModels.Quiz
{
    public class GetStudentsAttempt
    {
        public int QuizId {  get; set; }
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? StudentName { get; set; }
    }
}
