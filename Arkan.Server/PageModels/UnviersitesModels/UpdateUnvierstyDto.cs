using System.ComponentModel.DataAnnotations;

namespace Arkan.Server.PageModels.UnviersitesModels
{
    public class UpdateUnvierstyDto
    {
        [Required]
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        public string ShortName { get; set; }
        public IFormFile? Image { get; set; }
    }
}
