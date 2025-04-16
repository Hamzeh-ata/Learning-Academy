namespace Arkan.Server.Models
{
    public class CoursesPackages : BaseModel
    {
        public int CourseId { get; set; }
        public Course Course { get; set; }
        public int PackageId { get; set; }
        public Package Package { get; set; }

    }
}
