using Arkan.Server.Enums;
using Arkan.Server.Notifications;
using Arkan.Server.PageModels.NotificationModels;
using Arkan.Server.PageModels.PackageModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace Arkan.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserNotificationsController : ControllerBase
    {
        private readonly INotificationService _notificationService;
        public UserNotificationsController(INotificationService notificationService)
        {
            _notificationService = notificationService;
        }

        [HttpGet]
        public async Task<IActionResult> GetUserNotifications()
        {
            var userId = await GetCurrentUserIdAsync();

            if (userId is null)
            {
                return Unauthorized();
            }

            var result = await _notificationService.GetUserNotifications(userId);

            return Ok(result);
        }

        [HttpPost("Delete")]
        public async Task<IActionResult> DeleteNotifications(List<int> NotificationsIds)
        {
            var userId = await GetCurrentUserIdAsync();

            if (userId is null)
            {
                return Unauthorized();
            }
            var result = await _notificationService.DeleteUserNotifications(userId,NotificationsIds);

            if (!result)
            {
                return BadRequest();
            }

            return Ok();
        }

        private async Task<string> GetCurrentUserIdAsync()
        {

            if (!User.Identity.IsAuthenticated)
            {
                return null;
            }

            var userId = User.FindFirst("uid")?.Value;
            return userId;
        }

    }
}
