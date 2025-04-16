namespace Arkan.Server.PageModels.CategoriesModels
{
    public class GetRelatedCourses
    {
        public int CategoryId { get; set; }
        public List<CourseInfo> Courses { get; set; }
    }

}
