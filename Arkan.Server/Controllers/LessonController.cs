using Arkan.Server.Enums;
using Arkan.Server.Interfaces;
using Arkan.Server.Models;
using Arkan.Server.PageModels.LessonsModels;
using Arkan.Server.PagesServices;
using Arkan.Server.Repository;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Arkan.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LessonController : ControllerBase
    {

        private readonly ILessonInterface _LessonService;
        public LessonController(ILessonInterface LessonService)
        {
            _LessonService = LessonService;

        }

        [HttpGet("{ChapterId}")]
        public async Task<IActionResult> GetChapterLesson(int ChapterId)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _LessonService.GetChapterLessons(ChapterId);

            return Ok(result);
        }

        [HttpPost("")]
        public async Task<IActionResult> AddLesson([FromForm] AddLesson model)
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

            var result = await _LessonService.AddLesson(model,userId);

            if(result.Key != ResponseKeys.Success.ToString())
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [HttpPut("")]
        public async Task<IActionResult> UpdateLesson([FromForm] UpdateLesson model)
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

            var result = await _LessonService.UpdateLesson(model,userId);

            if (result.Key != ResponseKeys.Success.ToString())
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [HttpDelete("{LessonId}")]
        public async Task<IActionResult> DeleteLesson(int LessonId)
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

            var result = await _LessonService.DeleteLesson(LessonId, userId);

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
