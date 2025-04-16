using System.ComponentModel.DataAnnotations;

namespace Arkan.Server.Client_PageModels.Chapters
{
    public class ClientUpdateChapter
    {
        [Required]
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        public string Description { get; set; }
        public bool IsFree { get; set; }
    }
}
