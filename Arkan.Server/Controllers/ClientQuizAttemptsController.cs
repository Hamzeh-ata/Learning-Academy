using Arkan.Server.Client_Interfaces;
using Arkan.Server.Client_PageModels.Quiz;
using Arkan.Server.Enums;
using Arkan.Server.PageModels.QuizModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Arkan.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClientQuizAttemptsController : ControllerBase
    {
        private readonly IInstructorQuizReview _IInstructorQuizReview;
        public ClientQuizAttemptsController(IInstructorQuizReview IInstructorQuizReview)
        {
            _IInstructorQuizReview = IInstructorQuizReview;
        }

        [HttpGet]
        public async Task<IActionResult> GetStudentsAttempt([FromQuery] GetStudentsAttempt model)
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

            var result = await _IInstructorQuizReview.GetStudentsAttempts(model, userId);

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
