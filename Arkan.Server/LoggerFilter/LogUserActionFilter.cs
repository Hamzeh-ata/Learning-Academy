using Arkan.Server.BaseRepository;
using Arkan.Server.Data;
using Arkan.Server.Enums;
using Arkan.Server.Models;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Arkan.Server.LoggerFilter
{
    public class LogUserActionFilter : IAsyncActionFilter
    {
        private readonly ApplicationDBContext _context;
        private readonly IBaseRepository _IBaseRepository;

        public LogUserActionFilter(ApplicationDBContext context, IBaseRepository IBaseRepository)
        {
            _context = context;
            _IBaseRepository = IBaseRepository;
        }

        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var resultContext = await next();

            var userId = context.HttpContext.User.FindFirst("uid")?.Value;
            if (userId != null)
            {
                var roles = context.HttpContext.User.FindAll(ClaimTypes.Role)?.Select(c => c.Value).ToList();
                var requestMethod = context.HttpContext.Request.Method;
                if (roles.Contains(Roles.Admin.ToString()) && requestMethod != "GET")
                {
                    var action = requestMethod + " " + context.HttpContext.Request.Path;
                    var dateTime = DateTime.UtcNow;

                    // Retrieve item details from HttpContext.Items
                    var itemType = resultContext.HttpContext.Items["ItemType"]?.ToString() ?? "default";
                    var itemName = resultContext.HttpContext.Items["ItemName"]?.ToString() ?? "default";

                    var activity = new AdminActivity
                    {
                        UserId = userId,
                        Action = action,
                        DateTime = dateTime,
                        ItemType = itemType,
                        ItemName = itemName
                    };

                    await _IBaseRepository.AddAsync<AdminActivity>(activity);
                }
            }
        }
    }
}
