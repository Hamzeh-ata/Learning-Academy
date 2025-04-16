using Arkan.Server.Enums;
using System.ComponentModel.DataAnnotations;

namespace Arkan.Server.PageModels.CategoriesModels
{
    public class AddCategory
    {
        [Required]
        public string Name { get; set; }
        public string? Description { get; set; }
        public CategoryStatus Status { get; set; }
        public IFormFile Image { get; set; }
    }
}
