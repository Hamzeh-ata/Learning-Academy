namespace Arkan.Server.PageModels.QuizModels
{
    public class GetAnswers
    {
        public int Id { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? Image { get; set; }
        public bool IsCorrect { get; set; }
        public int Order { get; set; }
    }
}
