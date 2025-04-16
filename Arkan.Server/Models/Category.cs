using Arkan.Server.Enums;
using System.ComponentModel.DataAnnotations.Schema;

namespace Arkan.Server.Models
{
    public class Category : BaseModel
    {
        public string Name { get; set; }
        public CategoryStatus Status { get; set; }
        public ICollection<CoursesCategories> CoursesCategories { get; set; }
        public string? Image { get; set; }
        [NotMapped]
        public IFormFile Photo { get; set; }
        public string? Description { get; set; }


    }
}
