namespace Arkan.Server.PageModels.QuizModels
{
    public class AddAnswersDto
    {
        public int QuestionId { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public IFormFile? Image { get; set; }
        public bool IsCorrect { get; set; }
        public int Order { get; set; }
    }
}
