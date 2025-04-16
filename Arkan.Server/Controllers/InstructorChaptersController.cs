using Arkan.Server.Client_Interfaces;
using Arkan.Server.Client_PageModels.Chapters;
using Arkan.Server.Enums;
using Microsoft.AspNetCore.Mvc;

namespace Arkan.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InstructorChaptersController : ControllerBase
    {
        private readonly IInstructorCourse _IInstructorCourse;

        public InstructorChaptersController(IInstructorCourse IInstructorCourse)
        {
            _IInstructorCourse = IInstructorCourse;
        }

        [HttpPost("")]
        public async Task<IActionResult> AddChapterAsync(ClientAddChapter model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var userId = await GetCurrentUserIdAsync();

            var result = await _IInstructorCourse.AddChapterAsync(model, userId);

            if (result.Key != ResponseKeys.Success.ToString())
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [HttpPut("")]
        public async Task<IActionResult> UpdateChapterAsync(ClientUpdateChapter model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = await GetCurrentUserIdAsync();

            var result = await _IInstructorCourse.UpdateChapterAsync(model, userId);

            if (result.Key != ResponseKeys.Success.ToString())
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [HttpDelete("{ChapterId}")]
        public async Task<IActionResult> DeleteChapterAsync(int ChapterId)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = await GetCurrentUserIdAsync();

            var result = await _IInstructorCourse.DeleteChapterAsync(ChapterId, userId);

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
