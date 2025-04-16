using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations.Schema;

namespace Arkan.Server.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string FirstName {  get; set; }
        public string LastName { get; set; }
        public bool IsBlocked {  get; set; }
        public string? BlockDescription { get; set; }
        public string? ProfileImage { get; set; }
        [NotMapped]
        public IFormFile Photo { get; set; }
        public ICollection<UsersRoles> UserRoles { get; set; }
        public ICollection<RefreshToken>? RefreshTokens { get; set; }
        public ICollection<UserQuizAttempt>? UserQuizAttempts { get; set; }

    }
}
