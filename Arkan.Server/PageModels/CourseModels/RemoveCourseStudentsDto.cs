using System.ComponentModel.DataAnnotations;

namespace Arkan.Server.PageModels.CourseModels

{
    public class RemoveCourseStudentsDto
    {
        [Required]
        public int CourseId { get; set; }
        [Required]
        public List<string> UserIds { get; set; }
    }
}
