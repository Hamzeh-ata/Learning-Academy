using Arkan.Server.ClientMessagesModels;

namespace Arkan.Server.Messages_Interfaces
{
    public interface IChatRoom
    {
        Task<List<GetCoursesRoomMessages>> GetRoomMessages(string userId, int roomId, int pageNumber, int pageSize);
        Task<GetSentRoomMessage> SendMessage(string userId, SendRoomMessage model);
        Task<string> DeleteMessage(string userId, int messageId);
        Task<GetAddedReaction> AddReaction(string userId, AddReaction model);
        Task<GetAddedReaction> UpdateReaction(string userId, UpdateReaction model);
        Task<string> DeleteReaction(string userId, int reActionId);
        Task<List<RoomChatsSummary>> GetUserCourseRooms(string userId);
        Task<string> MarkAsSeen(string userId, int roomId);
        Task<List<RoomUsers>> GetRoomUsers(int roomId, string currentUserId);
        Task<List<string>> GetRoomAttachments(int roomId);
        Task<string> MuteStudent(int roomId, string currentUserId, string studentUserId);
        Task<string> UnMuteStudent(int roomId, string currentUserId, string studentUserId);
        Task<string> MuteStudent(int roomId, string studentUserId);
        Task<string> UnMuteStudent(int roomId,string studentUserId);
        Task<List<RoomChatsSummary>> GetAllCourseRooms();
        Task<List<RoomUsers>> GetAllRoomUsers(int roomId);

    }
}
