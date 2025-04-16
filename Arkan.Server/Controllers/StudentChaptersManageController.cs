using Arkan.Server.Enums;
using Arkan.Server.Interfaces;
using Arkan.Server.PageModels.ManageHiddenChapters;
using Microsoft.AspNetCore.Mvc;

namespace Arkan.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudentChaptersManageController : ControllerBase
    {
        private readonly IManageHiddenChapters _ManageHiddenChapters;
        public StudentChaptersManageController(IManageHiddenChapters ManageHiddenChapters)
        {
            _ManageHiddenChapters = ManageHiddenChapters;
        }

        [HttpPost("Hide")]
        public async Task<IActionResult> HideChapterForStudents(HideChapterStudents model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _ManageHiddenChapters.HideChapterForStudents(model);

            if (result != ResponseKeys.Success.ToString())
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [HttpPost("UnHide")]
        public async Task<IActionResult> UnhideChapterForStudents(UnHideChapterStudents model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _ManageHiddenChapters.UnhideChapterForStudents(model);

            if (result != ResponseKeys.Success.ToString())
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [HttpGet("ChapterStudents")]
        public async Task<IActionResult> ChapterStudents(int chapterId, int courseId, int pageNumber =1, int pageSize = 20)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _ManageHiddenChapters.ChapterStudents(chapterId, courseId, pageNumber , pageSize);

            return Ok(result);
        }

        [HttpGet("NoneChapterStudents")]
        public async Task<IActionResult> NoneChapterStudents(int chapterId, int courseId, int pageNumber = 1, int pageSize = 20)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _ManageHiddenChapters.NoneChapterStudents(chapterId, courseId, pageNumber, pageSize);

            return Ok(result);
        }

    }
}
