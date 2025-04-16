using Arkan.Server.Client_Interfaces;
using Arkan.Server.Enums;
using Arkan.Server.Interfaces;
using Arkan.Server.PageModels.CategoriesModels;
using Arkan.Server.Repository;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Arkan.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CartArkanCodeController : ControllerBase
    {
        private readonly IUserCart _UserCartService;
        public CartArkanCodeController(IUserCart UserCartService)
        {
            _UserCartService = UserCartService;
        }

        [HttpPost("")]
        public async Task<IActionResult> AddArkanCode(int itemId, string code)
        {

            var userId = await GetCurrentUserIdAsync();

            if (string.IsNullOrEmpty(userId))
            {
                return BadRequest(ResponseKeys.UserNotFound.ToString());
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var result = await _UserCartService.AddArkanCode(userId,itemId, code);

            if (result.Key != ResponseKeys.Success.ToString())
            {
                return BadRequest(result);
            }

            return Ok(result);
        }


        [HttpDelete("{itemId}")]
        public async Task<IActionResult> RemoveArkanCode(int itemId)
        {

            var userId = await GetCurrentUserIdAsync();

            if (string.IsNullOrEmpty(userId))
            {
                return BadRequest(ResponseKeys.UserNotFound.ToString());
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var result = await _UserCartService.RemoveArkanCode(userId, itemId);

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
