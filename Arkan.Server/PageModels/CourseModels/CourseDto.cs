namespace Arkan.Server.PageModels.CourseModels
{
    public class CourseDto 
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string? Image { get; set; }
        public string? Status { get; set; }
        public int StudentsCount { get; set; }
    }
}
