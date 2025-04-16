using System.ComponentModel.DataAnnotations.Schema;

namespace Arkan.Server.Models
{
    public class InstructorsSection : BaseModel
    {
        public int Order { get; set; }
        public int InstructorId { get; set; }
        [ForeignKey("InstructorId")]
        public Instructor Instructor { get; set; }

    }
}
