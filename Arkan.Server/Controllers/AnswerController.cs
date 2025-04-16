using Arkan.Server.Enums;
using Arkan.Server.Interfaces;
using Arkan.Server.PageModels.QuizModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Arkan.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AnswerController : ControllerBase
    {
        private readonly IAnswerInterface _IAnswerInterface;
        public AnswerController(IAnswerInterface IAnswerInterface)
        {
            _IAnswerInterface = IAnswerInterface;
        }

        [HttpPost]
        public async Task<IActionResult> AddQuestion([FromForm] AddAnswersDto model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _IAnswerInterface.AddAnswer(model);

            if(result.Key != ResponseKeys.Success.ToString())
            {
                return BadRequest(result);
            }

            return Ok(result);

        }

        [HttpPut]
        public async Task<IActionResult> UpdateAnswer([FromForm] UpdateAnswer model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _IAnswerInterface.UpdateAnswer(model);

            if (result.Key != ResponseKeys.Success.ToString())
            {
                return BadRequest(result);
            }

            return Ok(result);

        }

        [HttpGet("{QuestionId}")]
        public async Task<IActionResult> GetQuestionAnswers(int QuestionId)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _IAnswerInterface.GetQuestionAnswers(QuestionId);

            return Ok(result);

        }

        [HttpDelete("{AnswerId}")]
        public async Task<IActionResult> DeletetAnswer(int AnswerId)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _IAnswerInterface.DeleteAnswer(AnswerId);

            if (result != ResponseKeys.Success.ToString())
            {
                return BadRequest(result);
            }

            return Ok(result);

        }

    }
}
