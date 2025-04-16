using System.ComponentModel.DataAnnotations;

namespace Arkan.Server.StudentModels
{
    public class ChangePasswordAdminForm
    {
        [Required]
        public string UserId {  get; set; }

        
        [Required]
        [DataType(DataType.Password)]
        public string NewPassword { get; set; }
    }
}
