using System.ComponentModel.DataAnnotations;

namespace Arkan.Server.PageModels.StudentModels
{
    public class AddCoursesToStudent
    {
        [Required]
        public string UserId {  get; set; }
        [Required]
        public List<int> CourseId { get; set; }

    }
}
