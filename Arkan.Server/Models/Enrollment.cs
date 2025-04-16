namespace Arkan.Server.Models
{
    public class Enrollment : BaseModel
    {
        public DateTime EnrollmentDate { get; set; }
        public int StudentId { get; set; }
        public Student Student { get; set; }
        public int CourseId { get; set; }
        public Course Course { get; set; }

    }
}
