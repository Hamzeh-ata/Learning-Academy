using Arkan.Server.Client_Interfaces;
using Arkan.Server.Client_PageModels.InstructorQuiz;
using Arkan.Server.Enums;
using Arkan.Server.Interfaces;
using Arkan.Server.PageModels.HomePageModels;
using Arkan.Server.PageModels.QuizModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Arkan.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InstructorQuizController : ControllerBase
    {
        private readonly IInstructorQuiz _IInstructorQuiz;
        public InstructorQuizController(IInstructorQuiz IInstructorQuiz)
        {
            _IInstructorQuiz = IInstructorQuiz;
        }

        [HttpPost]
        public async Task<IActionResult> AddQuiz([FromBody] ClientAddQuiz model)
        {
            var userId = await GetCurrentUserIdAsync();

            if ( userId is null)
            {
                return Unauthorized();
            }

            var result = await _IInstructorQuiz.AddQuiz(model, userId);

            if (result.Key != ResponseKeys.Success.ToString())

            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [HttpGet("{lessonId}")]
        public async Task<IActionResult> GetQuiz(int lessonId)
        {

            var userId = await GetCurrentUserIdAsync();

            if (userId is null)
            {
                return Unauthorized();
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);

            }

            var result = await _IInstructorQuiz.GetQuiz(lessonId, userId);

            if(result.Key != ResponseKeys.Success.ToString())
            {
                return BadRequest(result);
            }

            return Ok(result);

        }

        [HttpPut]
        public async Task<IActionResult> UpdateQuiz([FromBody] ClientUpdateQuiz model)
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

            var result = await _IInstructorQuiz.UpdateQuiz(model, userId);

            if (result.Key != ResponseKeys.Success.ToString())
            {
                return BadRequest(result);
            }

            return Ok(result);

        }

        [HttpDelete("{QuizId}")]
        public async Task<IActionResult> RemoveQuiz(int QuizId)
        {
            var userId = await GetCurrentUserIdAsync();

            if (userId is null)
            {
                return Unauthorized();
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);

            }

            var result = await _IInstructorQuiz.RemoveQuiz(QuizId, userId);

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
