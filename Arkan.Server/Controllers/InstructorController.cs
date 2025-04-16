using Arkan.Server.Enums;
using Arkan.Server.Interfaces;
using Arkan.Server.Models;
using Arkan.Server.Repository;
using Arkan.Server.StudentModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Arkan.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InstructorController : ControllerBase
    {
        private readonly IInstructorInterface _InstructorInterface;
        private readonly UserManager<ApplicationUser> _userManager;

        public InstructorController(IInstructorInterface InstructorService, UserManager<ApplicationUser> userManager)
        {
            _InstructorInterface = InstructorService;
            _userManager = userManager;
        }

        [HttpGet("")]
        public async Task<IActionResult> GetAllInstructors(int pageNumber = 1, int pageSize = 10)
        {
            var result = await _InstructorInterface.GetAll(pageNumber, pageSize);
            return Ok(result);
        }

        [HttpDelete("{UserID}")]
        public async Task<IActionResult> DeleteInstructor(string UserID)
        {
            if (UserID is null)
            {
                return BadRequest();
            }
            var result = await _InstructorInterface.DeleteInstructor(UserID);
            if(result != ResponseKeys.Success.ToString())
            {
                return BadRequest(result);
            }
            return Ok(result);
        }

        [HttpPost("Change-Password")]
        public async Task<IActionResult> ChangeInstructorPassword([FromBody] ChangePasswordAdminForm model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var result = await _InstructorInterface.ChangeInstructorPassword(model);

            if (result != ResponseKeys.Success.ToString())
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        private async Task<string> GetCurrentUserIdAsync()
        {
            ClaimsPrincipal currentUser = this.User;
            var currentUserName = currentUser.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (currentUserName != null)
            {
                ApplicationUser user = await _userManager.FindByNameAsync(currentUserName);
                if (user != null)
                {
                    return user.Id;
                }
            }
            return null;
        }




    }
}
