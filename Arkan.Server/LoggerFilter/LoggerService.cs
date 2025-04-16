using Arkan.Server.BaseRepository;
using Arkan.Server.Data;
using Arkan.Server.Enums;
using Arkan.Server.Helpers;
using Arkan.Server.Models;
using Arkan.Server.PageModels.PageModels;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Arkan.Server.LoggerFilter
{
    public class LoggerService: ILoggerService
    {

        private readonly ApplicationDBContext _context;
        private readonly IBaseRepository _IBaseRepository;
        public LoggerService(ApplicationDBContext context, UserManager<ApplicationUser> userManager, IBaseRepository IBaseRepository)
        {
            _context = context;
            _IBaseRepository = IBaseRepository;
         
        }

        public async Task AddLog(string userId,string Action , string ItemType,string ItemName)
        {
            var log = new AdminActivity
            {
                UserId = userId,
                Action = Action,
                ItemName = ItemName,
                ItemType = ItemType,
                DateTime = _IBaseRepository.GetJordanTime()
            };

            await _IBaseRepository.AddAsync<AdminActivity>(log);
        }
    
        public async Task<PaginationResult<Log>> GetAllLogs(int pageNumber,int pageSize)
        {
            var query = _context.AdminActivity
             .OrderByDescending(aa => aa.DateTime)
             .Select(aa => new Log
             {
                 Id = aa.Id,
                 UserName = $"{aa.User.FirstName} {aa.User.LastName}",
                 Action = aa.Action,
                 Type = aa.ItemType,
                 ItemName= aa.ItemName,
                 DateTime = aa.DateTime.ToShortDateString(),

             })
             .AsQueryable();

            var paginationResult = await PaginationHelper.PaginateAsync(query, pageNumber, pageSize);

            return paginationResult;
        }

        public async Task<string> DeleteLog(int id)
        {
            var log = await _context.AdminActivity
                .Where(aa => aa.Id == id)
                .FirstOrDefaultAsync();

           if(log == null)
            {
                return ResponseKeys.NotFound.ToString();
            }

            _IBaseRepository.Remove<AdminActivity>(log);

            return ResponseKeys.Success.ToString();
        }

    }
}
