using System.ComponentModel.DataAnnotations;

namespace Arkan.Server.PageModels.InstructorModels
{
    public class InstructorInformaition
    {
        public string UserId { get; set; }
        public string? Image { get; set; }
   
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public DateTime? BirthDate { get; set; }
        public string Sex { get; set; }
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
        public string Key { get; set; }
    }
}
