using System.ComponentModel.DataAnnotations;

namespace Arkan.Server.Models
{
    public class Page : BaseModel
    {
        [Required]
        public string Name {  get; set; }
        public string? ComponentName { get; set; }
        public ICollection<PagePermissions> PagePermissions { get; set; }
    }
}
