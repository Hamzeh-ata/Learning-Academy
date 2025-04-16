using Arkan.Server.Enums;
using Arkan.Server.Interfaces;
using Arkan.Server.Models;
using Arkan.Server.PageModels.QuizModels;
using Arkan.Server.PagesServices;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Arkan.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuizController : ControllerBase
    {
        private readonly IQuizInterface _IQuizInterface;
        public QuizController(IQuizInterface IQuizInterface)
        {
            _IQuizInterface = IQuizInterface;
        }

        [HttpPost]
        public async Task<IActionResult> AddQuiz([FromBody] AddQuizDto model)
        {
            if(!ModelState.IsValid) {

             return BadRequest(ModelState);

            }

            var result = await _IQuizInterface.AddQuiz(model);

            if (result.Key != ResponseKeys.Success.ToString())
            {
                return BadRequest(result);
            }

            return Ok(result);

        }

        [HttpGet("{lessonId}")]
        public async Task<IActionResult> GetQuiz(int lessonId)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _IQuizInterface.GetQuiz(lessonId);

            if (result.Key != ResponseKeys.Success.ToString())
            {
                return BadRequest(result);
            }

            return Ok(result);

        }

        [HttpGet("Id/{lessonId}")]
        public async Task<IActionResult> GetQuizId(int lessonId)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _IQuizInterface.GetQuizId(lessonId);

            return Ok(result);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateQuiz([FromBody] UpdateQuizDto model)
        {
            if (!ModelState.IsValid)
            {

                return BadRequest(ModelState);

            }

            var result = await _IQuizInterface.UpdateQuiz(model);

            if (result.Key != ResponseKeys.Success.ToString())
            {
                return BadRequest(result);
            }

            return Ok(result);

        }

        [HttpDelete("{QuizId}")]
        public async Task<IActionResult> RemoveQuiz(int QuizId)
        {
            if (!ModelState.IsValid)
            {

                return BadRequest(ModelState);

            }

            var result = await _IQuizInterface.RemoveQuiz(QuizId);

            if (result != ResponseKeys.Success.ToString())
            {
                return BadRequest(result);
            }

            return Ok(result);

        }


    }
}
