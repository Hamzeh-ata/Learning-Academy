using Arkan.Server.Client_Interfaces;
using Arkan.Server.Client_Repositories;
using Arkan.Server.Enums;
using Arkan.Server.Interfaces;
using Arkan.Server.PageModels.ChaptersModels;
using Arkan.Server.Repository;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Arkan.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CheckOutController : ControllerBase
    {
        private readonly IUserOrders _UserOrdersService;

        public CheckOutController(IUserOrders UserOrdersService)
        {
            _UserOrdersService = UserOrdersService;
        }
        

        [HttpPost()]
        public async Task<IActionResult> CheckOut(string? code)
        {
            var userId = GetCurrentUserIdAsync();

            if (string.IsNullOrEmpty(userId))
            {
                return BadRequest(ResponseKeys.UserNotFound.ToString());
            }

            var result = await _UserOrdersService.SubmitUserOrder(code, userId);

            if(result != ResponseKeys.Success.ToString())
            {
                return BadRequest(result);
            }
            return Ok(result);
        }

        private string GetCurrentUserIdAsync()
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
