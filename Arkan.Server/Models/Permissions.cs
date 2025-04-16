using System.ComponentModel.DataAnnotations;

namespace Arkan.Server.Models
{
    public class Permissions : BaseModel
    {
        [Required]

        public string Name { get; set; }
        public ICollection<RolePermissions> RolePermissions { get; set; }
        public ICollection<PagePermissions> PagePermissions { get; set; }
        
    }
}
