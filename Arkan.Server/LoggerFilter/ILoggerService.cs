using Arkan.Server.Helpers;
using Arkan.Server.PageModels.PageModels;

namespace Arkan.Server.LoggerFilter
{
    public interface ILoggerService
    {
        Task AddLog(string userId, string Action, string ItemType, string ItemName);
        Task<PaginationResult<Log>> GetAllLogs(int pageNumber, int pageSize);
        Task<string> DeleteLog(int id);
    }
}
