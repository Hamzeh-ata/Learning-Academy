using Arkan.Server.Enums;
using Arkan.Server.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Arkan.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LogoutController : ControllerBase
    {
        private readonly ISessions _IUserSessionsService;
        public LogoutController(ISessions UserSessionsService)
        {
            _IUserSessionsService = UserSessionsService;
        }

        [HttpPut]
        public async Task<IActionResult> UpdateSessionStatus()
        {
            var userId = await GetCurrentUserIdAsync();

            if (string.IsNullOrEmpty(userId))
            {
                return BadRequest(ResponseKeys.UserNotFound.ToString());
            }
            var result = await _IUserSessionsService.UpdateSessionStatus(userId);

            return Ok(result);
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
