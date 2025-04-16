using Arkan.Server.Enums;

namespace Arkan.Server.Models
{
    public class Sessions : BaseModel
    {
        public string UserId { get; set; }
        public ApplicationUser User { get; set; }
        public string DeviceType { get; set; }
        public string Browser { get; set; }
        public string OperatingSystem { get; set; }
        public string IPaddress { get; set; }
        public DateTime FirstLoggedTime { get; set; }
        public DateTime LastLoggedTime { get; set; }
        public SessionStatus Status {  get; set; }
        public Roles Role { get; set;  }
    }
}
