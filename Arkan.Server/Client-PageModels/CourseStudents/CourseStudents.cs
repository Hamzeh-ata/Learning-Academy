namespace Arkan.Server.Client_PageModels.CourseStudents
{
    public class CourseStudents
    {
        public int Id { get; set; }
        public string UserId {  get; set; }
        public string Email { get; set; }
        public string Name { get; set; }
        public string? Image { get; set; }
        public DateTime EnrollmentDate {  get; set; }
    }
}
