namespace Arkan.Server.Models
{
    public class CoursesMessagesReaction : BaseModel
    {
        public int CoursesRoomMessagesId { get; set; }
        public CoursesRoomMessages CoursesRoomMessages { get; set; }
        public string UserId { get; set; }
        public ApplicationUser User { get; set; }
        public string Emoji { get; set; }
    }
}
