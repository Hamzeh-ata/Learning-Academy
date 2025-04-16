using Arkan.Server.AuthServices;
using Arkan.Server.Enums;
using Arkan.Server.Interfaces;
using Arkan.Server.Models;
using Arkan.Server.Repository;
using Arkan.Server.StudentModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Arkan.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class StudentController : ControllerBase
    {
        private readonly IStudentInterface _StudentService;
        private readonly UserManager<ApplicationUser> _userManager;
        public StudentController(IStudentInterface StudentService, UserManager<ApplicationUser> userManager)
        {
            _StudentService = StudentService;
            _userManager = userManager;
        }


        [HttpGet("")]
        public async Task<IActionResult> GetAllStudents(int pageNumber = 1, int pageSize = 10)
       {
            var result = await _StudentService.GetAll(pageNumber, pageSize);
            return Ok(result);
        }

        [HttpDelete("{UserID}")]
        public async Task<IActionResult> DeleteStudent(string UserID,string currentUserId)
        {
            if (UserID is null)
            {
                return BadRequest();
            }

            var result = await _StudentService.DeleteStudent(UserID, currentUserId);

            if(result!= ResponseKeys.Success.ToString()) {

                return BadRequest(result);
            }
            return Ok(result);
        }

        [HttpPost("Change-Password")]
        public async Task<IActionResult> ChangeStudentPassword([FromBody] ChangePasswordAdminForm model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            string currentUserId = await GetCurrentUserIdAsync();

            if(currentUserId is null)
            {
                return Unauthorized();
            }
            var result = await _StudentService.ChangeStudentPassword(model, currentUserId);

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
