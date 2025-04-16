using Arkan.Server.Client_Interfaces;
using Arkan.Server.Enums;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Arkan.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CompleteLessonController : ControllerBase
    {

        private readonly IClientChapters _ClientChaptersService;
        public CompleteLessonController(IClientChapters ClientChapterssService)
        {
            _ClientChaptersService = ClientChapterssService;
        }

        [HttpPost("{LessonId}")]
        public async Task<IActionResult> AddLessonAsCompleted(int LessonId)
        {
            var userId = await GetCurrentUserIdAsync();

            if (userId is null)
            {
                return BadRequest(ResponseKeys.UserNotFound.ToString());

            }

            var result = await _ClientChaptersService.LessonCompleted(LessonId, userId);

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
