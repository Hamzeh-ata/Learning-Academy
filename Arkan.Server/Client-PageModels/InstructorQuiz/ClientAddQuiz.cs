namespace Arkan.Server.Client_PageModels.InstructorQuiz
{
    public class ClientAddQuiz
    {
        public int LessonId { get; set; }
        public string Title { get; set; }
        public string? Description { get; set; }
        public int TimeLimit { get; set; }
        public bool IsRequired { get; set; }
        public bool IsRandomized { get; set; }
        public double TotalMarks { get; set; }
    }
}
