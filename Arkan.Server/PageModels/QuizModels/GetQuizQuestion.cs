

namespace Arkan.Server.PageModels.QuizModels
{
    public class GetQuizQuestion
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string? Image { get; set; }
        public double Points { get; set; }
        public int? Order { get; set; }
        public List<GetQuizAnswer> Answers { get; set; }
    }
}
