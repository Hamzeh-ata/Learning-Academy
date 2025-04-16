using Arkan.Server.Client_PageModels.LiveSessions;
using Arkan.Server.Enums;

namespace Arkan.Server.Client_Interfaces
{
    public interface ILiveSession
    {
        Task<GetLive> Add(LiveDto model, string userId);
        Task<GetLive> Update(LiveDto model, string userId);
        Task<string> Delete(int id, string userId);
        Task<List<GetLive>> GetUserLives(string userId);
        Task<string> ToggleLive(int liveId, string meetingId, LiveSessionStatus status, bool notifyUsers, string userId);
        Task<GetLive> GetLiveById(int liveId, string userId);
    }
}
