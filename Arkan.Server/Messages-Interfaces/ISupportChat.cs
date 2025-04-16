using Arkan.Server.ClientMessagesModels;
using Arkan.Server.SupportChat_PageModels;

namespace Arkan.Server.Messages_Interfaces
{
    public interface ISupportChat
    {
        Task<GetSupportMessage> SendMessage(string? userId, SendSupportMessage model);
        Task<string> DeleteRoomChat(string userId, int roomId);
        Task<List<GetSupportRoomMessages>> GetRoomMessages(string? userId ,int roomId);
        Task<List<ClientChatSummary>> GetSupportChatSummaries(string userId);
        Task<int> GetCurrentUserChatRoom(string userId);
    }
}
