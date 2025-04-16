using Arkan.Server.Enums;
using Arkan.Server.Interfaces;
using Arkan.Server.PageModels.PackageModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Arkan.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserSessionsController : ControllerBase
    {
        private readonly ISessions _IUserSessionsService;
        public UserSessionsController(ISessions UserSessionsService)
        {
            _IUserSessionsService = UserSessionsService;
        }


        [HttpGet("")]
        public async Task<IActionResult> GetActiveSessions()
        {
            var result = await _IUserSessionsService.GetActiveSessions();

            return Ok(result);
        }

        [HttpGet("{UserId}")]
        public async Task<IActionResult> GetSessions(string UserId)
        {
            var result = await _IUserSessionsService.GetSessions(UserId);

            return Ok(result);
        }

        [HttpDelete("{Id}")]
        public async Task<IActionResult> DeleteSession(int Id)
        {
            var result = await _IUserSessionsService.DeleteSession(Id);

            if (result != ResponseKeys.Success.ToString())
            {
                return BadRequest(result);
            }

            return Ok(result);
        }
    }
}
