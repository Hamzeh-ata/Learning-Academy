namespace Arkan.Server.Models
{
    public class CoursesChatRooms : BaseModel
    {
        public int CourseId {  get; set; }
        public Course Course { get; set; }
        public ICollection<CoursesRoomMessages> CoursesRoomMessages { get; set; }

    }
}
