using Arkan.Server.PageModels.CourseModels;

namespace Arkan.Server.PageModels.PackageModels
{
    public class GetPackage
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public double Price { get; set; }
        public double DiscountPrice { get; set; }
        public string? Image { get; set; }
        public int CoursesCount { get; set; }
        public List<GetCoursesMainInfo> Courses { get; set; }
        public string Key { get; set; }

    }
}
