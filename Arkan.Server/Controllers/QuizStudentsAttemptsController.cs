using Arkan.Server.Client_Interfaces;
using Arkan.Server.Client_PageModels.Quiz;
using Arkan.Server.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Arkan.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuizStudentsAttemptsController : ControllerBase
    {
        private readonly IQuizStudentsAttempts _IQuizStudentsAttemptsService;
        public QuizStudentsAttemptsController(IQuizStudentsAttempts IQuizStudentsAttemptsService)
        {
            _IQuizStudentsAttemptsService = IQuizStudentsAttemptsService;
        }
        [HttpPost]
        public async Task<IActionResult> GetStudentsAttempt([FromBody] GetStudentsAttempt model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var result = await _IQuizStudentsAttemptsService.GetStudentsAttempts(model);

            return Ok(result);

        }
    }
}
