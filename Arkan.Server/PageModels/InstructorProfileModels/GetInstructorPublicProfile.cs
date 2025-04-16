namespace Arkan.Server.PageModels.InstructorProfileModels
{
    public class GetInstructorPublicProfile
    {
        public int Id {  get; set; }
        public string UserId {  get; set; }
        public string Name {  get; set; }
        public string Email { get; set; }
        public string Bio {  get; set; }
        public string Phone { get; set; }
        public string Specialty { get; set; }
        public string Location {  get; set; }
        public string linkedin { get; set; }
        public string Facebook { get; set; }
        public string Instagram { get; set; }
        public string Twitter { get; set; }
        public string OfficeHours { get; set; }
        public string Experience { get; set; }
        public string Image { get; set; }
        public int StudentsCount {  get; set; }
        public int CoursesCount {  get; set; }
        public int LessonsCount {  get; set; }
        public bool ShowStudentsCount {  get; set; }
        public string Sex { get; set; }
        public List<InstructorProfileCourses> Courses { get; set; } 
        public string Key {  get; set; }
    }
    public class InstructorProfileCourses
    {
        public int Id { get; set; }
        public string Image {  set; get; }
        public string Name { get; set; }
        public string Description { get; set; }
    }
}
