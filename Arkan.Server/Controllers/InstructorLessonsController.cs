using Arkan.Server.Client_Interfaces;
using Arkan.Server.Client_PageModels.Lessons;
using Arkan.Server.Enums;
using Microsoft.AspNetCore.Mvc;

namespace Arkan.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InstructorLessonsController : ControllerBase
    {
        private readonly IInstructorCourse _IInstructorCourse;
        public InstructorLessonsController(IInstructorCourse InstructorCourseService)
        {
            _IInstructorCourse = InstructorCourseService;
        }

        [HttpGet("{ChapterId}")]
        public async Task<IActionResult> GetLessons(int ChapterId)
        {
            var result = await _IInstructorCourse.GetChapterLessons(ChapterId);
            return Ok(result);
        }

        [HttpPost("")]
        public async Task<IActionResult> AddLessonAsync([FromForm] AddLesson model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var userId = await GetCurrentUserIdAsync();

            if (userId is null)
            {
                return Unauthorized();
            }

            var result = await _IInstructorCourse.AddLesson(model, userId);

            if (result.Key != ResponseKeys.Success.ToString())
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [HttpPut("")]
        public async Task<IActionResult> UpdateLessonAsync([FromForm] UpdateLesson model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = await GetCurrentUserIdAsync();

            if (userId is null)
            {
                return Unauthorized();
            }

            var result = await _IInstructorCourse.UpdateLesson(model, userId);

            if (result.Key != ResponseKeys.Success.ToString())
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [HttpDelete("{LessonId}")]
        public async Task<IActionResult> DeleteLessonAsync(int LessonId)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = await GetCurrentUserIdAsync();

            if (userId is null)
            {
                return Unauthorized();
            }

            var result = await _IInstructorCourse.DeleteLesson(LessonId, userId);

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
