using System.ComponentModel.DataAnnotations;

namespace Arkan.Server.PageModels.UserPagesModels
{
    public class AddPageDto
    {
        [Required]
        public string Name { get; set; }
        [Required]
        public string ComponentName { get; set; }

    }
}
