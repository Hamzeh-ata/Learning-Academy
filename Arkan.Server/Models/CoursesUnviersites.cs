namespace Arkan.Server.Models
{
    public class CoursesUnviersites : BaseModel
    {
        public int CourseId { get; set; }
        public Course Course { get; set; }
        public int UniversityId { get; set; }
        public University University { get; set; }
    }
}
