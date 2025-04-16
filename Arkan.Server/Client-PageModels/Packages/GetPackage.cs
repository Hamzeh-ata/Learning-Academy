using System.Security.Policy;

namespace Arkan.Server.Client_PageModels.Packages
{
    public class GetPackage
    {
        public int Id { get; set; }
        public string Image { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int CoursesCount { get; set; }
        public int LessonsCount {  get; set; }
        public bool IsEnrolled {  get; set; }
        public bool IsInCart {  get; set; }
        public bool IsPending { get; set; }
        public string Key {  get; set; }
        public List<GetPackageCourses> Courses {  get; set; }
    }

    public class GetPackageCourses
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Image { get; set; }
        public string Instructor {  get; set; }
        public List<string> Universities { get; set; }

    }
}
