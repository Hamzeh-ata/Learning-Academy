using System.ComponentModel.DataAnnotations;

namespace Arkan.Server.Models
{
    public class Quiz : BaseModel
    {
        [Required]
        public int LessonId {  get; set; }
        public Lesson Lesson { get; set; }
        [Required]
        public string Title { get; set; }
        public string? Description { get; set; }
        public bool IsRandomized { get; set; }
        public bool IsRequierd { get; set; }
        public bool AllowReAttempt { get; set; }
        [Required]
        public double TotalMarks {  get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public double? TimeLimit { get; set; }
        public ICollection<Question> Questions { get; set; }
    }
}
