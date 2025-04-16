namespace Arkan.Server.Models
{
    public class Instructor: BaseModel
    {
        public string? Bio { get; set; }
        public string? Specialization { get; set; }
        public string? LinkedIn { get; set; }
        public string? Twitter { get; set; }
        public string? Facebook { get; set; }
        public string? Instagram { get; set; }
        public string? Experience { get; set; }
        public string? OfficeHours { get; set; }
        public string? Location { get; set; }
        public string? Sex { get; set; }
        public string UserId { get; set; }
        public bool showStudentsCount {  get; set; }
        public ApplicationUser User { get; set; }
        public ICollection<Course>? Courses { get; set; }
    }
}
