using Arkan.Server.Models;

namespace Arkan.Server.PageModels.CourseModels
{
    public class FilterCourse
    {
        public int Id { get; set; }
        public string? Image { get; set; }
        public string Name { get; set; }
        public float Price { get; set; }
        public float? DiscountPrice { get; set; }
        public string Status { get; set; }
        public int StudentsCount { get; set; }
        public string? InstructorName { get; set; }
        public int ? InstructorId { get; set; }
        public string? Description { get; set; }
        public float? OffLinePrice { get; set; }
        public int ChaptersCount {  get; set; }
        public ICollection<CoursesPackages> CoursesPackages { get; set; }
        public ICollection<Enrollment> Enrollments { get; set; }
        public ICollection<CoursesUnviersites> CoursesUnviersites { get; set; }
        public ICollection<CoursesCategories> CoursesCategories { get; set; }


    }
}
