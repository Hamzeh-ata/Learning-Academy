using Arkan.Server.Enums;
using Arkan.Server.Interfaces;
using Arkan.Server.PageModels.CourseModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Arkan.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CourseController : ControllerBase
    {
        private readonly ICourseInterface _CourseRepository;
        public CourseController(ICourseInterface CourseRepository)
        {
            _CourseRepository = CourseRepository;
        }
        [HttpPost()]
        public async Task<IActionResult> AddCourse([FromForm] AddCourseModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            var userId = await GetCurrentUserIdAsync();

            if (userId is null)
            {
                return Unauthorized();
            }

            var result = await _CourseRepository.AddCourseAsync(model, userId);

            if(result.Key != ResponseKeys.Success.ToString())
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [HttpPut()]
        public async Task<IActionResult> UpdateCourse([FromForm] UpdateCourseModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }
            var userId = await GetCurrentUserIdAsync();

            if (userId is null)
            {
                return Unauthorized();
            }
            var result = await _CourseRepository.UpdateCourseAsync(model, userId);

            if (result.Key != ResponseKeys.Success.ToString())
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [HttpGet]
        public async Task<IActionResult> GetCourses(int pageNumber = 1, int pageSize = 10)
        {
           var result = await _CourseRepository.GetPaginatedEntitiesAsync(pageNumber, pageSize);

           return Ok(result);
        }

        [HttpGet("{CourseId}")]
        public async Task<IActionResult> GetCourse(int CourseId)
        {
            if (CourseId < 0)
            {
                return BadRequest();
            }
            var result = await _CourseRepository.GetCourseById(CourseId);

            if (result.Key != ResponseKeys.Success.ToString())
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [HttpDelete("{CourseId}")]
        public async Task<IActionResult> DeleteCourse(int CourseId)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            var userId = await GetCurrentUserIdAsync();

            if (userId is null)
            {
                return Unauthorized();
            }

            var result = await _CourseRepository.RemoveCourseAsync(CourseId, userId);

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
