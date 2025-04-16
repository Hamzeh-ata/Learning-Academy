namespace Arkan.Server.Models
{
    public class StudentCompletedLessons : BaseModel
    {

        public int LessonId {  get; set; }
        public Lesson Lesson { get; set; }
        public int StudentId { get; set;}
        public Student Student { get; set; }

    }
}
