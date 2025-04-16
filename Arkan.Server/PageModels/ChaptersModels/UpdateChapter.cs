using System.ComponentModel.DataAnnotations;

namespace Arkan.Server.PageModels.ChaptersModels
{
    public class UpdateChapter
    {
        [Required]
        public int Id { get; set; }
        [Required]
        public int CourseId { get; set; }
        [Required]
        public string Name { get; set; }
        public string Description { get; set; }
        public bool IsFree { get; set; }
    }
}
