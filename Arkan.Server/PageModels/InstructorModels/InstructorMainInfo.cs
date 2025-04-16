using Arkan.Server.PageModels.CourseModels;

namespace Arkan.Server.PageModels.InstructorModels
{
    public class InstructorMainInfo
    {
        public string Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string phoneNumber { get; set; }
        public string Email { get; set; }
        public List<CourseDto> InstructorCourses { get; set; }
        public int CoursesCount { get; set; }
        public string Image {  get; set; }
    }
}
