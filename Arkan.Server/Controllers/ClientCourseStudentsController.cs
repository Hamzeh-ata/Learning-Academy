using Arkan.Server.Client_Interfaces;
using Arkan.Server.Client_PageModels.CourseStudents;
using Arkan.Server.Enums;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Arkan.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClientCourseStudentsController : ControllerBase
    {
        private readonly ICourseStudents _ICourseStudentsService;
        public ClientCourseStudentsController(ICourseStudents ICourseStudentsService)
        {
            _ICourseStudentsService = ICourseStudentsService;
        }

        [HttpPost]
        public async Task<IActionResult> GetCourse([FromBody] GetCourseStudents model)
        {
            var userId = await GetCurrentUserIdAsync();

            if (userId is null)
            {
                return Unauthorized();
            }

            var result = await _ICourseStudentsService.GetCourseStudents(model, userId);

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
