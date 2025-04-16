namespace Arkan.Server.Models
{
    public class Student : BaseModel
    {
        public string? University { get; set; }
        public DateTime? BirthDate { get; set; }
        public string? Sex { get; set; }
        public string UserId { get; set; }
        public ApplicationUser User { get; set; }
        public ICollection<StudentsPackages> StudentsPackages { get; set; }
        public ICollection<StudentCompletedLessons> StudentCompletedLessons { get; set; }
    }
}
