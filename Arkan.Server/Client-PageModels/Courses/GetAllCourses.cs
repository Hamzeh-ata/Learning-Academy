namespace Arkan.Server.Client_PageModels.Courses
{
    public class GetAllCourses
    {
        public int Id { get; set; }
        public int? InstructorId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string? InstructorName {  get; set; }
        public float Price {  get; set; }
        public float? DiscountPrice{ get; set;}
        public string Image {  get; set; }
        public int ChaptersCount { get; set; }
        public int LessonsCount {  get; set; }
        public int EnrollmentsCount {  get; set; }
        public List<string> Universities { get; set; }
    }
}
