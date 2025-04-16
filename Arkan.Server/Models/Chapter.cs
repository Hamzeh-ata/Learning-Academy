using System.ComponentModel.DataAnnotations;

namespace Arkan.Server.Models
{
    public class Chapter : BaseModel
    {
        [Required]
        public string Name {  get; set; }
        public string Description { get; set; }
        public bool IsFree {  get; set; }
        [Required]
        public int CourseId {  get; set; }
        public Course Course {  get; set; }
        public ICollection<Lesson> Lessons { get; set; }
    }
}
