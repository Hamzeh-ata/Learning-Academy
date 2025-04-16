using System.ComponentModel.DataAnnotations;

namespace Arkan.Server.PageModels.PackageModels
{
    public class UpdatePackageDto
    {
        [Required]
        public int Id { get; set; } 
        [Required]
        public string Name { get; set; }
        public string Description { get; set; }
        [Required]
        public double Price { get; set; }
        public double DiscountPrice { get; set; }
        public IFormFile? Image { get; set; }
        public List<int> CoursesIds { get; set; }

    }
}
