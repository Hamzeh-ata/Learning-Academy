using Arkan.Server.PageModels.StudentSessions;

namespace Arkan.Server.Interfaces
{
    public interface ISessions
    {
        Task<string> AddDeviceInfo(string userId, List<string> userRoles);
        Task<List<GetUserSessions>> GetSessions(string userId);
        Task<string> DeleteSession(int id);
        Task<string> UpdateSessionStatus(string userId);
        Task<List<GetUserSessions>> GetActiveSessions();
    }
}
