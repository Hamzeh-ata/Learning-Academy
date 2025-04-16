using System.ComponentModel.DataAnnotations;

namespace Arkan.Server.PageModels.LessonsModels
{
    public class UpdateLesson
    {
        [Required]
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string VideoUrl { get; set; }
        public bool IsFree { get; set; }
        public IFormFile? Material { get; set; }


    }
}
