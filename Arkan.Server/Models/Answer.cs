using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Arkan.Server.Models
{
    public class Answer : BaseModel
    {
        [Required]
        public int QuestionId { get; set; }
        public Question Question { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? ImageUrl { get; set; }
        [NotMapped]
        public IFormFile Photo { get; set; }
        public bool IsCorrect { get; set; }
        public int Order { get; set; }


    }
}
