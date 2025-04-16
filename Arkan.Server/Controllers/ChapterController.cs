using Arkan.Server.Enums;
using Arkan.Server.ImagesHelper;
using Arkan.Server.Interfaces;
using Arkan.Server.PageModels.ChaptersModels;
using Arkan.Server.Repository;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Arkan.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChapterController : ControllerBase
    {
        private readonly IChapterInterface _ChapterRepository;

        public ChapterController(IChapterInterface ChapterRepository)
        {
            _ChapterRepository = ChapterRepository;
        }

        [HttpPost()]
        public async Task<IActionResult> AddChapter([FromBody] AddChapter model)
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

            var result = await _ChapterRepository.AddChapterAsync(model,userId);

            if (result.Key != ResponseKeys.Success.ToString())
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [HttpGet()]
        public async Task<IActionResult> GetCourseChapters(int CourseId, int pageNumber = 1, int pageSize = 20)
        {
            if (CourseId == 0)
            {
                return BadRequest();
            }

            var result = await _ChapterRepository.GetCourseChaptersAsync(pageNumber, pageSize, CourseId);


            return Ok(result);
        }

        [HttpPut()]
        public async Task<IActionResult> UpdateChapter([FromBody] UpdateChapter model)
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

            var result = await _ChapterRepository.UpdateChapterAsync(model, userId);

            if (result.Key != ResponseKeys.Success.ToString())
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [HttpDelete("{Id}")]
        public async Task<IActionResult> DeleteChapter(int Id)
        {

            var userId = await GetCurrentUserIdAsync();

            if (userId is null)
            {
                return Unauthorized();
            }

            var result = await _ChapterRepository.DeleteChapterAsync(Id, userId);

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
