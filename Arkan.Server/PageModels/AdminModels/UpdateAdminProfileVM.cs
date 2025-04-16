using System.ComponentModel.DataAnnotations;

namespace Arkan.Server.PageModels.AdminModels
{
    public class UpdateAdminProfileVM
    {
        public string Id { get; set; }
        [Required]
        public string FirstName { get; set; }
        [Required]
        public string LastName { get; set; }
        [Required]
        public string Email { get; set; }
        [Required]
        public string UserName { get; set; }
        [Required] 
        public string PhoneNumber { get; set; }

        public List<AddAdminRolesDto> Roles { get; set; }

        public IFormFile? Image { get; set; }
    }
}
