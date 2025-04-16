namespace Arkan.Server.Models
{
    public class CoursesRoomMessages : BaseModel
    {
        public int CoursesChatRoomsId {  get; set; }
        public CoursesChatRooms CoursesChatRooms { get; set; }
        public string Content { get; set; }
        public string UserId { get; set; }
        public ApplicationUser User { get; set; }
        public string? FilePath { get; set; }
        public DateTime Timestamp { get; set; }
        public bool IsDeleted { get; set; }
        public int? ParentMessageID { get; set; }
        public CoursesRoomMessages? ParentMessage { get; set; }
        public List<CoursesMessagesReaction>? Reactions {  get; set; }

    }
  
}
