using Arkan.Server.Client_Interfaces;
using Arkan.Server.Enums;
using Arkan.Server.Interfaces;
using Arkan.Server.PageModels.UnviersitesModels;
using Arkan.Server.PageModels.UserCartModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Arkan.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserCartController : ControllerBase
    {
        private readonly IUserCart _UserCarService;
        public UserCartController(IUserCart UserCarService)
        {
            _UserCarService = UserCarService;
        }


        [HttpPost("")]
        public async Task<IActionResult> AddItem(AddItemCart model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var userId = await GetCurrentUserIdAsync();

            if(userId is null)
            {
                return BadRequest(ResponseKeys.UserNotFound.ToString());
            }

            var result = await _UserCarService.AddUserCart(model,userId);

            if (result.Key != ResponseKeys.Success.ToString())
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [HttpGet("")]
        public async Task<IActionResult> GetUserCart()
        {
            var userId = await GetCurrentUserIdAsync();

            var result = await _UserCarService.GetUserCart(userId);

            return Ok(result);
        }

        [HttpDelete("{ItemId}")]
        public async Task<IActionResult> DeleteItem(int ItemId)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var userId = await GetCurrentUserIdAsync();

            var result = await _UserCarService.DeleteItem(userId,ItemId);

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
