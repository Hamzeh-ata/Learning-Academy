using Arkan.Server.Client_Interfaces;
using Arkan.Server.Client_PageModels.Quiz;
using Arkan.Server.Enums;
using Arkan.Server.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Arkan.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuizAttemptController : ControllerBase
    {
        private readonly IStudentQuizRepository _StudentQuizRepositoryService;

        public QuizAttemptController(IStudentQuizRepository StudentQuizRepositoryService)
        {
            _StudentQuizRepositoryService = StudentQuizRepositoryService;
        }

        [HttpGet("{LessonId}")]
        public async Task<IActionResult> GetQuiz(int LessonId)
        {
            var userId = await GetCurrentUserIdAsync();

            if (userId is null)
            {
                return Unauthorized();
            }

            var result = await _StudentQuizRepositoryService.StartQuiz(LessonId, userId);

            if ( result.Key != ResponseKeys.Success.ToString())
            {
                return BadRequest(result);
            }

            return Ok(result);
        }


        [HttpDelete("{QuizId}")]
        public async Task<IActionResult> DeleteAttempet(int QuizId)
        {
            var userId = await GetCurrentUserIdAsync();

            if (userId is null)
            {
                return Unauthorized();
            }

            var result = await _StudentQuizRepositoryService.RemoveAttempet(QuizId, userId);

            if (result != ResponseKeys.Success.ToString())
            {
                return BadRequest(result);
            }

            return Ok(result);
        }


        [HttpPost("SubmitAnswer")]
        public async Task<IActionResult> SubmitAnswer(SubmitAnswer model)
        {
            var userId = await GetCurrentUserIdAsync();

            if (userId is null)
            {
                return Unauthorized();
            }

            var result = await _StudentQuizRepositoryService.SubmitAnswer(model, userId);

            if (result != ResponseKeys.Success.ToString())
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [HttpPost("FinishQuiz")]
        public async Task<IActionResult> FinishQuiz(int quizId)
        {
            var userId = await GetCurrentUserIdAsync();

            if (userId is null)
            {
                return Unauthorized();
            }

            var result = await _StudentQuizRepositoryService.FinishQuiz(quizId, userId);

            if (result.Key != ResponseKeys.Success.ToString())
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [HttpGet("QuizReview")]
        public async Task<IActionResult> QuizReview(int quizId)
        {
            var userId = await GetCurrentUserIdAsync();

            if (userId is null)
            {
                return Unauthorized();
            }

            var result = await _StudentQuizRepositoryService.QuizReview(quizId, userId);

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
