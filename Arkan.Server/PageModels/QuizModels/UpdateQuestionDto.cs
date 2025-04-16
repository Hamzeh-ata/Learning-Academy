namespace Arkan.Server.PageModels.QuizModels
{
    public class UpdateQuestionDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string? Description { get; set; }
        public IFormFile? Image { get; set; }
        public double Points { get; set; }
        public int? Order { get; set; }
    }
}
