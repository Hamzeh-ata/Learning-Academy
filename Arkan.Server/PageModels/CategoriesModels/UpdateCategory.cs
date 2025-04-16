using Arkan.Server.Enums;
using System.ComponentModel.DataAnnotations;

namespace Arkan.Server.PageModels.CategoriesModels
{
    public class UpdateCategory
    {
        [Required]
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        public CategoryStatus Status { get; set; }
        public string? Description { get; set; }
        public IFormFile? Image { get; set; }


    }
}
