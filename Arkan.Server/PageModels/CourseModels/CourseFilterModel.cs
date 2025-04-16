namespace Arkan.Server.PageModels.CourseModels
{
    public class CourseFilterModel
    {
        public int? CourseId { get; set; }
        public string? SortBy { get; set; } = "Name";
        public string? SortOrder { get; set; } = "asc";
        public string? InstructorId { get; set; }
        //public string? NotTaughtInstructorId { get; set; }
        public string? StudentId { get; set; }
        //public string? NonEnrollStudentId { get; set; }
        public string? CourseName { get; set; }
        public int? CategoryId { get; set; }
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public int? UniversityId { get; set; } 
        public int? PackageId { get; set; } 
        public string? Type {  get; set; }
    }
}
