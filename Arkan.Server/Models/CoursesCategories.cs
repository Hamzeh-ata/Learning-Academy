namespace Arkan.Server.Models
{
    public class CoursesCategories : BaseModel
    {
        public int CourseId {  get; set; }
        public Course Course { get; set; }
        public int CategoryId { get; set; } 
        public Category Category { get; set; }
    }
}
