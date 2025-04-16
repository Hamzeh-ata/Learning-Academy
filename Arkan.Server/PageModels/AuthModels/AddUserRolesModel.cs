using System.ComponentModel.DataAnnotations;

namespace Arkan.Server.PageModels.AuthModels
{
    public class AddUserRolesModel
    {
        [Required]
        public string UserId { get; set; }
        [Required]
        public string Role { get; set; }
    }
}
