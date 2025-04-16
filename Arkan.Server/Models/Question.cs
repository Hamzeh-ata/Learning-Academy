using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Arkan.Server.Models
{
    public class Question : BaseModel
    {
        [Required]
        public int QuizId { get; set; }
        public Quiz Quiz { get; set; }
        
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? ImageUrl { get; set; }
        [NotMapped]
        public IFormFile Photo { get; set; }
        public double Points { get; set; }
        public bool ShowPoints { get; set; }
        public int? Order { get; set; }
        public ICollection<Answer> Answers { get; set; }
    }
}
