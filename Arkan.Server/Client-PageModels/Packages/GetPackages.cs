namespace Arkan.Server.Client_PageModels.Packages
{
    public class GetPackages
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Image { get; set; }
        public string Description { get; set; }
        public double Price {  get; set; }
        public double DiscountPrice { get; set; }
        public int CoursesCount { get; set; }
        public int LessonsCount {  get; set; }
        public List<string>? Instructors {  get; set; }
    }
}
