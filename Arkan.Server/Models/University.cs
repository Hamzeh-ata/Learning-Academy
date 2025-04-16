using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Arkan.Server.Models
{
    public class University : BaseModel
    {
        [Required]
        public string Name { get; set; }
        public string ShortName {  get; set; }
        public string Image {  get; set; }
        [NotMapped]
        public IFormFile Photo { get; set; }
        public ICollection<CoursesUnviersites> CoursesUnviersites { get; set; }

    }
}
