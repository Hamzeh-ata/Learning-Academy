namespace Arkan.Server.Models
{
    public class CoursesChatMutedStudents : BaseModel
    {
        public string UserId {  get; set; }
        public ApplicationUser User { get; set; }
        public int CourseId { get; set; }
        public Course Course { get; set; }
    }
}
