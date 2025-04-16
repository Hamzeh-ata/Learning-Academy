using System.ComponentModel.DataAnnotations;

namespace Arkan.Server.PageModels.AdminModels
{
    public class AdminProfileVM
    {
        public string Id { get; set; }
        public string? Image { get; set; }
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
        public List<Dictionary<string, object>> Roles { get; set; }
        public string Key {  get; set; }

    }
}
