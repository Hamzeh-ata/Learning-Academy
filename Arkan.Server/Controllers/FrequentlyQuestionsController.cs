using Arkan.Server.Client_PageModels.LiveSessions;
using Arkan.Server.Enums;
using Arkan.Server.Interfaces;
using Arkan.Server.Models;
using Arkan.Server.PageModels.FrequentlyQuestions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Arkan.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FrequentlyQuestionsController : ControllerBase
    {
        private readonly IFrequentlyQuestions _FrequentlyQuestions;
        public FrequentlyQuestionsController(IFrequentlyQuestions FrequentlyQuestions)
        {
            _FrequentlyQuestions = FrequentlyQuestions;
        }

        [HttpPost]
        public async Task<IActionResult> AddQuestion(AddQuestion model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _FrequentlyQuestions.AddQuestion(model.Title, model.Answer);

            if (result.Key != ResponseKeys.Success.ToString())
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateQuestion(UpdateFrQuetion model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);

            }

            var result = await _FrequentlyQuestions.UpdateQuestion(model.Id, model.Title, model.Answer);

            if (result.Key != ResponseKeys.Success.ToString())
            {
                return BadRequest(result);
            }

            return Ok(result);

        }

        [HttpDelete("{Id}")]
        public async Task<IActionResult> DeleteQuestion(int Id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);

            }

            var result = await _FrequentlyQuestions.DeleteQuestion(Id);

            if (result != ResponseKeys.Success.ToString())
            {
                return BadRequest(result);
            }

            return Ok(result);

        }

        [HttpGet()]
        public async Task<IActionResult> GetAllQuestions()
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _FrequentlyQuestions.GetAllQuestions();

            return Ok(result);

        }

        [HttpGet("{Id}")]
        public async Task<IActionResult> GetQuestionById(int Id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _FrequentlyQuestions.GetQuestionById(Id);

            return Ok(result);

        }

    }
}
