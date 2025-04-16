using Arkan.Server.AuthServices;
using Arkan.Server.Enums;
using Arkan.Server.PageModels.AdminModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Arkan.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminInfoController : ControllerBase
    {

        private readonly IAdminService _IAdminService;
        public AdminInfoController(IAdminService IAdminService)
        {
            _IAdminService = IAdminService;
        }

        [HttpGet("{UserId}")]
        public async Task<IActionResult> GetAdminInfo(string UserId)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            var result = await _IAdminService.GetAdminInfo(UserId);

            if (result.Key != ResponseKeys.Success.ToString())
            {
                return BadRequest(result);
            }



            return Ok(result);
        }


        [HttpPut()]
        public async Task<IActionResult> UpdateAdminInfo([FromForm] UpdateAdminProfileVM model)
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

            var result = await _IAdminService.UpdateAdminInfo(model, currentUserId);

            if (result.Key != ResponseKeys.Success.ToString())
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
