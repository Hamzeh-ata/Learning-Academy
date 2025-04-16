using Arkan.Server.Enums;
using Arkan.Server.Interfaces;
using Arkan.Server.PageModels.PackageModels;
using Arkan.Server.PageModels.PromoCodes;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Arkan.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PromoCodeController : ControllerBase
    {
        private readonly IPromoCodes _IPromoCodes;
        public PromoCodeController(IPromoCodes PromoCodesService)
        {
            _IPromoCodes = PromoCodesService;
        }

        [HttpPost("")]
        public async Task<IActionResult> AddPromoCode(AddPromoCode model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var result = await _IPromoCodes.AddPromoCode(model);

            if (result.Key != ResponseKeys.Success.ToString())
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [HttpGet("")]
        public async Task<IActionResult> GetPromoCodes()
        {
            var result = await _IPromoCodes.GetPromoCodes();

            return Ok(result);
        }

        [HttpPut("")]
        public async Task<IActionResult> UpdatePromoCode(UpdatePromoCode model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _IPromoCodes.UpdatePromoCode(model);

            if (result.Key != ResponseKeys.Success.ToString())
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [HttpGet("{Id}")]
        public async Task<IActionResult> GetPromoCode(int Id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _IPromoCodes.GetPromoCode(Id);

            if (result.Key != ResponseKeys.Success.ToString())
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [HttpDelete("{Id}")]
        public async Task<IActionResult> RemovePromoCode(int Id)
        {
            if (Id <= 0)
            {
                return BadRequest();
            }

            var result = await _IPromoCodes.RemovePromoCode(Id);

            if (result != ResponseKeys.Success.ToString())
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [HttpPost("Check")]
        public async Task<IActionResult> CheckPromoCode(string code, double orderAmount)
        {
            var userId = await GetCurrentUserIdAsync();

            if (userId is null)
            {
                return Unauthorized();
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var result = await _IPromoCodes.CheckPromoCode(code, orderAmount, userId);

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
