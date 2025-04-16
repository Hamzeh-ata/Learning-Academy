namespace Arkan.Server.PageModels.CategoriesModels
{
    public class CourseInfo
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string? Status { get; set; }
        public int StudentsCount { get; set; }
        public string? InstructorName { get; set; }
    }
}
