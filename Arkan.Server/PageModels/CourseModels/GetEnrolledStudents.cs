namespace Arkan.Server.PageModels.CourseModels
{
    public class GetEnrolledStudents
    {
        public int Id {  get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get;set;}
        public string Sex {  get; set; }
        public DateTime EnrollDate { get; set; }
        public string University { get; set; }
    }
}
