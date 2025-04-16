using Arkan.Server.Enums;
using Arkan.Server.Interfaces;
using Arkan.Server.Models;
using Arkan.Server.PageModels.PromoCodes;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Arkan.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ForgotPasswordController : ControllerBase
    {
        private readonly IForgotPassword _IForgotPassword;
        public ForgotPasswordController(IForgotPassword ForgotPassword)
        {
            _IForgotPassword = ForgotPassword;
        }

        [HttpPost("")]
        public async Task<IActionResult> ForgotPasswordRequest(string email, string newPassword)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _IForgotPassword.ForgotPasswordRequest(email, newPassword);

            if (result.Key != ResponseKeys.Success.ToString())
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [HttpGet("")]
        public async Task<IActionResult> GetChangePasswordRequests()
        {
            var result = await _IForgotPassword.GetChangePasswordRequests();

            return Ok(result);
        }

        [HttpPost("{Id}")]
        public async Task<IActionResult> ConfirmRequest(int Id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _IForgotPassword.ConfirmRequest(Id);

            if (result != ResponseKeys.Success.ToString())
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [HttpDelete("{Id}")]
        public async Task<IActionResult> DeleteRequest(int Id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _IForgotPassword.DeleteRequest(Id);

            if (result != ResponseKeys.Success.ToString())
            {
                return BadRequest(result);
            }

            return Ok(result);
        }
    }
}
