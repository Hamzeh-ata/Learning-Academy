using System.ComponentModel.DataAnnotations;

namespace Arkan.Server.PageModels.AuthModels
{
    public class TokenRequestModel
    {
        [Required]
        public string Email { get; set; }
        //[Required]
        //public string UserName { get; set; }
        [Required]
        public string Password { get; set; }
        //[Required]
        //public string Token { get; set; }

    }
}
