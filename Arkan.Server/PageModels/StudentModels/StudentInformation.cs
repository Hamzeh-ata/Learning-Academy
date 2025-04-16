using System.ComponentModel.DataAnnotations;

namespace Arkan.Server.PageModels.StudentModels
{
    public class StudentInformation
    {
        [Required]
        public string UserId { get; set; }
        public string? University { get; set; }
        [Required]

        public string FirstName { get; set; }
        [Required]

        public string LastName { get; set; }
        [Required]

        public string Email { get; set; }
        [Required]

        public string? PhoneNumber { get; set; }
        public DateTime? BirthDate { get; set; }
        public string? Sex { get; set; }
        public IFormFile? Image { get; set; }
    }
}
