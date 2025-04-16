using Arkan.Server.PageModels.CourseModels;

namespace Arkan.Server.PageModels.StudentModels
{
    public class StudentCoursesDto
    {
        public List<GetCoursesMainInfo> Items { get; set; }
        public string Key { get; set; }

    }
}
