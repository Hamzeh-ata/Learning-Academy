
using Arkan.Server.PageModels.CourseModels;

namespace Arkan.Server.PageModels.StudentModels
{
    public class GetNonEnrolledCourses
    {
        public string UserId { get; set; }
        public List<CourseDto> Courses { get; set; }
    }
}
