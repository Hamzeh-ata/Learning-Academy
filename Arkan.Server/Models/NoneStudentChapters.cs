namespace Arkan.Server.Models
{
    public class NoneStudentChapters : BaseModel
    {
        public string UserId {  get; set; }
        public int ChapterId { get; set;}
        public Chapter Chapter { get; set; }
        public int CourseId { get; set; }
    }
}
