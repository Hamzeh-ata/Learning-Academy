namespace Arkan.Server.PageModels.HomePageModels
{
    public class GetCourseSection
    {
        public int Id { get; set; }
        public int CourseId { get; set; }
        public string Name { get; set; }
        public string Image { get; set; }
        public float Price { get; set; }
        public string Description { get; set; }
        public float DiscountPrice { get; set; }
        public string InstructorName { get; set; }
        public int ChaptersCount { get; set; }
        public List<string> Universities { get; set; }
        public int Order { get; set; }
        public int LessonsCount {  get; set; }
        public string Key { get; set; }
    }
}
