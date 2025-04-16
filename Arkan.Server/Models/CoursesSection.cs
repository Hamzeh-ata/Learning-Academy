using System.ComponentModel.DataAnnotations.Schema;

namespace Arkan.Server.Models
{
    public class CoursesSection : BaseModel
    {
        public int Order {  get; set; }
        public int CourseId {  get; set; }
        [ForeignKey("CourseId")]
        public Course Course { get; set; }
    }
}
