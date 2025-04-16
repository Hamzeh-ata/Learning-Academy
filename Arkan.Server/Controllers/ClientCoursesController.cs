using Arkan.Server.Client_Interfaces;
using Arkan.Server.Enums;
using Arkan.Server.Interfaces;
using Arkan.Server.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Arkan.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClientCoursesController : ControllerBase
    {
        private readonly IClientCourses _ClientCoursesService;
        public ClientCoursesController(IClientCourses ClientCoursesService)
        {
            _ClientCoursesService = ClientCoursesService;
        }

        [HttpGet("AllCourses")]
        public async Task<IActionResult> GetAllCourses(int pageNumber = 1, int PageSize = 20)
        {
            var result = await _ClientCoursesService.GetAllCourses(pageNumber, PageSize);

            return Ok(result);
        }


        [HttpGet("{CourseId}")]
        public async Task<IActionResult> GetCourse(int CourseId)
        {
            var userId = await GetCurrentUserIdAsync();

            var result = await _ClientCoursesService.GetCourse(CourseId, userId ?? null);

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
