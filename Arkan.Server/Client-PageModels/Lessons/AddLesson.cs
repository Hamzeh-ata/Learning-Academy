using System.ComponentModel.DataAnnotations;

namespace Arkan.Server.Client_PageModels.Lessons
{
    public class AddLesson
    {
        [Required]
        public int ChapterId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string VideoUrl { get; set; }
        public IFormFile? Material { get; set; }
        public bool IsFree { get; set; }

    }
}
