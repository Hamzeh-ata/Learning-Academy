namespace Arkan.Server.Client_PageModels.CourseStudents
{
    public class GetCourseStudents
    {
        public int CourseId { get;set; }
        public int PageNumber { get; set; } = 1;
        public int PageSize {  get; set; } = 10;
        public string? StudentName { get; set; }
    }
}
