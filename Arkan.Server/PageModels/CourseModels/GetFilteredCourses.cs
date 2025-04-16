namespace Arkan.Server.PageModels.CourseModels
{
    public class GetFilteredCourses
    {
        public int Id { get; set; }
        public string? Image { get; set; }
        public string Name { get; set; }
        public float Price { get; set; }
        public float? DiscountPrice { get; set; }
        public string Status { get; set; }
        public int StudentsCount { get; set; }
        public string? InstructorName { get; set; }
        public int? InstructorId { get; set; }
        public string? Description { get; set; }
        public float? OffLinePrice { get; set; }
    }
}
