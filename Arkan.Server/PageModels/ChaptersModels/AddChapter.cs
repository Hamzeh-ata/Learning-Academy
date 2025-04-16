using System.ComponentModel.DataAnnotations;

namespace Arkan.Server.PageModels.ChaptersModels
{
    public class AddChapter
    {
        [Required]
        public int CourseId { get; set; }
        [Required]
        public string Name { get; set; }
        public string Description { get; set; }
        public bool IsFree { get; set; }

    }
}
