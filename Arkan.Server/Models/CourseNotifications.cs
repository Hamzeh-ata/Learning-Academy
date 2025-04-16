using Arkan.Server.Enums;

namespace Arkan.Server.Models
{
    public class CourseNotifications : BaseModel
    {
        public int CourseId {  get; set; }
        public Course Course { get; set; }
        public string Message { get; set; }
        public DateTime Timestamp { get; set; }
    }
}
