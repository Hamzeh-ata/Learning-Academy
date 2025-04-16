using Arkan.Server.Enums;
using Arkan.Server.Interfaces;
using Arkan.Server.PageModels.ProfileModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Arkan.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserProfileController : ControllerBase
    {
        private readonly IProfileInterFace _ProfileRepository;
        public UserProfileController(IProfileInterFace IProfileRepository)
        {
            _ProfileRepository = IProfileRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetProfileInfo()
        {
            var currentUserId = await GetCurrentUserIdAsync();

            if (string.IsNullOrEmpty(currentUserId))
            {
                return BadRequest(ResponseKeys.UserNotFound.ToString());
            }

            var result = await _ProfileRepository.GetUserProfileInfo(currentUserId);

            if (result.Key != ResponseKeys.Success.ToString())
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateProfileInfo([FromForm] UpdateUserProfileInfo model)
        {
            var currentUserId = await GetCurrentUserIdAsync();

            if (string.IsNullOrEmpty(currentUserId))
            {
                return BadRequest(ResponseKeys.UserNotFound.ToString());
            }

            var result = await _ProfileRepository.UpdateUserProfileInfo(model, currentUserId);

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
