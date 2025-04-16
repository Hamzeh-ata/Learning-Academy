using Arkan.Server.Enums;

namespace Arkan.Server.Client_PageModels.LiveSessions
{
    public class LiveDto
    {
        public int Id { get; set; }
        public string Title {  get; set; }
        public string? Description { get; set; }
        public int CourseId { get; set; }
        public LiveSessionStatus Status { get; set; }
        public DateTime StartTime {  get; set; }
        public DateTime EndTime { get; set; }
        public int UsersCount { get; set; }
        public bool IsStarted { get; set; }
        public string? MeetingId {  get; set; }
    }
}
