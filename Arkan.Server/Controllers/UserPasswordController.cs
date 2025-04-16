using Arkan.Server.Client_Interfaces;
using Arkan.Server.Enums;
using Arkan.Server.StudentModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Arkan.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserPasswordController : ControllerBase
    {
        private readonly IUserPassword _UserPasswordService;
        public UserPasswordController(IUserPassword UserPasswordService)
        {
            _UserPasswordService = UserPasswordService;
        }

        [HttpPost()]
        public async Task<IActionResult> ChangePassword([FromBody] string NewPassword)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = await GetCurrentUserIdAsync();

            var result = await _UserPasswordService.ChangePassword(NewPassword, userId);

            if (result != ResponseKeys.Success.ToString())
            {
                return BadRequest(result);
            }

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
