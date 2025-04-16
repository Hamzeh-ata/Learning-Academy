using Arkan.Server.Models;
using System.Text.Json.Serialization;

namespace Arkan.Server.PageModels.AuthModels
{
    public class AuthModel
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Key { get; set; }
        public bool IsAuthenticated { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public List<string> Roles { get; set; }
        public string Token { get; set; }
        //public DateTime? ExpiresOn { get; set; }
        //public List<UserPages> userPages { get; set; }

        [JsonIgnore]
        public string? RefreshToken { get; set; }
        public DateTime RefreshTokenExpiration { get; set; }

    }
}
