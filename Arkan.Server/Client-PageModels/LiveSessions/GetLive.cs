using Arkan.Server.Enums;

namespace Arkan.Server.Client_PageModels.LiveSessions
{
    public class GetLive
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public int CourseId { get; set; }
        public string CourseName {  get; set; }
        public string InstructorUserId { get; set; }
        public int InstructorId { get; set; }
        public string InstructorName {  get; set; }
        public LiveSessionStatus Status { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public int UsersCount { get; set; }
        public List<GetLiveStudents> Students { get; set; }
        public string CourseImage {  get; set; }
        public string Key { get; set; }
        public bool IsOwner { get; set; }
        public Boolean IsStarted { get; set; } = false;
        public string? MeetingId { get; set; }
    }

    public class GetLiveStudents
    {
        public int Id { get; set; }
        public string UserName { get; set; }
    }
    
}
