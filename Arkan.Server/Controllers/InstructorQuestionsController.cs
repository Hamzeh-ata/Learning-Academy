using Arkan.Server.Client_Interfaces;
using Arkan.Server.Enums;
using Arkan.Server.Interfaces;
using Arkan.Server.PageModels.QuizModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Arkan.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InstructorQuestionsController : ControllerBase
    {
        private readonly IInstructorQuestion _IInstructorQuestion;

        public InstructorQuestionsController(IInstructorQuestion IInstructorQuestion)
        {
            _IInstructorQuestion = IInstructorQuestion;
        }

        [HttpPost]
        public async Task<IActionResult> AddQuestion([FromForm] AddQuestionDto model)
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

            var result = await _IInstructorQuestion.AddQuestion(model , userId);

            if (result.Key != ResponseKeys.Success.ToString())
            {
                return BadRequest(result);
            }

            return Ok(result);

        }

        [HttpPut]
        public async Task<IActionResult> UpdateQuestion([FromForm] UpdateQuestionDto model)
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

            var result = await _IInstructorQuestion.UpdateQuestion(model, userId);

            if (result.Key != ResponseKeys.Success.ToString())
            {
                return BadRequest(result);
            }

            return Ok(result);

        }

        [HttpGet("{QuizId}")]
        public async Task<IActionResult> GetQuestions(int QuizId)
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

            var result = await _IInstructorQuestion.GetQuizQuestions(QuizId, userId);

            return Ok(result);

        }

        [HttpDelete("{QuestionId}")]
        public async Task<IActionResult> DeletetQuestion(int QuestionId)
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

            var result = await _IInstructorQuestion.DeleteQuestion(QuestionId, userId);

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
