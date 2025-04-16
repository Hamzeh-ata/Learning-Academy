using Arkan.Server.Enums;
using Arkan.Server.Interfaces;
using Arkan.Server.PageModels.QuizModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Arkan.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuestionController : ControllerBase
    {

        private readonly IQuestionInterface _IQuestionInterface;
        public QuestionController(IQuestionInterface IQuestionInterface)
        {
            _IQuestionInterface = IQuestionInterface;
        }

        [HttpPost]
        public async Task<IActionResult> AddQuestion([FromForm] AddQuestionDto model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _IQuestionInterface.AddQuestion(model);

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

            var result = await _IQuestionInterface.UpdateQuestion(model);

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

            var result = await _IQuestionInterface.GetQuizQuestions(QuizId);

            return Ok(result);

        }

        [HttpDelete("{QuestionId}")]
        public async Task<IActionResult> DeletetQuestion(int QuestionId)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _IQuestionInterface.DeleteQuestion(QuestionId);

            if (result != ResponseKeys.Success.ToString())
            {
                return BadRequest(result);
            }

            return Ok(result);

        }

    }
}
