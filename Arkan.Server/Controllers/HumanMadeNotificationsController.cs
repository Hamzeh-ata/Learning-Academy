using Arkan.Server.Enums;
using Arkan.Server.Notifications;
using Arkan.Server.PageModels.NotificationModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Arkan.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HumanMadeNotificationsController : ControllerBase
    {
        private readonly INotificationService _notificationService;
        public HumanMadeNotificationsController(INotificationService notificationService)
        {
            _notificationService = notificationService;
        }

        [HttpGet]
        public async Task<IActionResult> GetHumanMadeNotifications()
        {
            var result = await _notificationService.GetHumanMadeNotifications();

            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> AddNotification(AddHumanMadeNotification model)
        {
            var result = await _notificationService.AddHumanMadeNotification(model);

            if (result.Key != ResponseKeys.Success.ToString())
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateHumanMadeNotification(UpdateHumanMadeNotification model)
        {
            var result = await _notificationService.UpdateHumanMadeNotification(model);

            if (result.Key != ResponseKeys.Success.ToString())
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [HttpGet("{Id}")]
        public async Task<IActionResult> GetHumanMadeNotification(int Id)
        {
            var result = await _notificationService.GetHumanMadeNotification(Id);

            if(result.Key != ResponseKeys.Success.ToString())
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [HttpDelete("{Id}")]
        public async Task<IActionResult> DeleteNotifications(int Id)
        {
            var result = await _notificationService.DeleteHumanMadeNotification(Id);

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
