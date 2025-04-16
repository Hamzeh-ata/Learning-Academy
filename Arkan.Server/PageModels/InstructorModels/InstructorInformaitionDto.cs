using System.ComponentModel.DataAnnotations;

namespace Arkan.Server.PageModels.InstructorModels
{
    public class InstructorInformaitionDto
    {
        [Required]
        public string UserId { get; set; }
        [Required]
        public string FirstName { get; set; }
        [Required]
        public string LastName { get; set; }
        [Required]
        public string Email { get; set; }
        [Required]
        public string PhoneNumber { get; set; }
        public IFormFile? Image { get; set; }
        public string? Sex { get; set; }
        public string? Bio { get; set; }
        public string? Specialization { get; set; }
        public string? LinkedIn { get; set; }
        public string? Twitter { get; set; }
        public string? Facebook { get; set; }
        public string? Instagram { get; set; }
        public string? Experience { get; set; }
        public string? OfficeHours { get; set; }
        public string? Location { get; set; }
        public bool ShowStudentsCount { get; set; }

    }
}
