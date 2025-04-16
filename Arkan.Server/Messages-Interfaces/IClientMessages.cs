using Arkan.Server.ClientMessagesModels;

namespace Arkan.Server.Messages_Interfaces
{
    public interface IClientMessages
    {
        Task<GetSentRoomMessage> SendMessage(string userId, AddClientMessages model);
        Task<string> DeleteMessageForUser(string userId, int messageId);
        Task<string> DeleteRoomChat(string userId, int roomId);
        Task<string> DeleteMessage(string userId, int messageId);
        Task<List<GetClientRoomMessages>> GetRoomMessages(string userId, int roomId);
        Task<List<RoomChatsSummary>> GetChatSummaries(string userId);
        Task<GetAddedReaction> AddReaction(string userId, AddReaction model);
        Task<GetAddedReaction> UpdateReaction(string userId, UpdateReaction model);
        Task<string> DeleteReaction(string userId, int reActionId);
        Task<List<GetStudentInstructors>> GetStudentInstructors(string userId);
        Task<GetStartedRoom> StartChat(string CurrentUserId, string ReceiverId);
        Task<RoomChatsSummary> GetStudentInstructorRoom(string currentUserId, string UserId);
    }
}
