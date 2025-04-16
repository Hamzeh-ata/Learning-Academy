using Arkan.Server.Models;

namespace Arkan.Server.PageModels.StudentModels
{
    public class StudentMainInfo
    {

        public string Id { get; set; }
        //public string Name { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string phoneNumber { get; set; }
        public string Email { get; set; }   
        public int CoursesCount { get; set; }
        public string? University { get; set; }
        public DateTime? BirthDate { get; set; }
        public string? Sex { get; set; }
        public string? Image { get; set; }

    }
}
