using Arkan.Server.Enums;
using Arkan.Server.Models;

namespace Arkan.Server.PageModels.StudentSessions
{
    public class GetUserSessions
    {
        public int Id { get; set; } 
        public string UserId { get; set; }

        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Email { get; set; }
        public string? Image { get; set; }
        public string DeviceType { get; set; }
        public string Browser { get; set; }
        public string OperatingSystem { get; set; }
        public string IPaddress { get; set; }
        public DateTime FirstLoggedTime { get; set; }
        public DateTime LastLoggedTime { get; set; }
        public SessionStatus Status { get; set; }
        public Roles Role { get; set; }
    }
}
