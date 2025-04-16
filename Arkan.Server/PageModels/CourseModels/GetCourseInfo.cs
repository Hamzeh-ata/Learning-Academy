using Arkan.Server.Enums;

namespace Arkan.Server.PageModels.CourseModels
{
    public class GetCourseInfo
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public float Price { get; set; }
        public float? DiscountPrice { get; set; }
        public CourseStatus Status { get; set; }
        public int StudentsCount { get; set; }
        public string InstructorName { get; set; }
        public int? EnrollmentLimit { get; set; }
        public List<CourseCategories> Categories { get; set; }
        public List<CourseUniversities> Universities { get; set; }
        public string? Image {  get; set; }
        public string? InstructorId { get; set; }
        public string? OverViewUrl { get; set; }
        public string? CoverImage { get; set; }

        public string Key { get; set; }
    }
}
