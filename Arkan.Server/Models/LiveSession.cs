using Arkan.Server.Enums;

namespace Arkan.Server.Models
{
    public class LiveSession : BaseModel
    {
        public string Title {  get; set; }
        public string Description { get; set; }
        public int InstructorId {  get; set; }
        public Instructor instructor { get; set; }
        public int CourseId {  get; set; }
        public Course Course { get; set; }
        public int UsersCount { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public LiveSessionStatus Status {  get; set; }
        public bool IsStarted { get; set; }
        public string? MeetingId { get; set; }
    }
}
