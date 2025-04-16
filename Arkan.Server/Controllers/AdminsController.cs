using Arkan.Server.AuthServices;
using Arkan.Server.Enums;
using Arkan.Server.PageModels.AdminModels;
using Arkan.Server.StudentModels;
using Microsoft.AspNetCore.Mvc;

namespace Arkan.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminsController : ControllerBase
    {
        private readonly IAdminService _IAdminService;
        public AdminsController(IAdminService IAdminService)
        {
            _IAdminService = IAdminService;
        }

        [HttpGet()]
        public async Task<IActionResult> GetAllAdminUsers()
        {
            var admins = await _IAdminService.GetAllAdmins();

            return Ok(admins);
        }

        [HttpPost()]
        public async Task<IActionResult> AddAdmin([FromForm] AddAdminVM model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }
            string currentUserId = await GetCurrentUserIdAsync();

            if (currentUserId is null)
            {
                return Unauthorized();
            }
            var result = await _IAdminService.AddAdmin(model, currentUserId);

            if (result.Key != ResponseKeys.Success.ToString())
            {
                return BadRequest(result);
            }
            return Ok(result);
        }

        [HttpDelete("{UserId}")]
        public async Task<IActionResult> DeleteUser(String UserId)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }
            string currentUserId = await GetCurrentUserIdAsync();

            if (currentUserId is null)
            {
                return Unauthorized();
            }
            var result = await _IAdminService.DeleteAdmin(UserId, currentUserId);

            if (result != ResponseKeys.Success.ToString())
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [HttpPost("Change-Password")]
        public async Task<IActionResult> ChangeAdminPassword([FromBody] ChangePasswordAdminForm model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            string currentUserId = await GetCurrentUserIdAsync();

            if (currentUserId is null)
            {
                return Unauthorized();
            }

            var result = await _IAdminService.ChangeAdminPassword(model, currentUserId);

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
