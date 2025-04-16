using Arkan.Server.Enums;
using Arkan.Server.Interfaces;
using Arkan.Server.LoggerFilter;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Arkan.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoggerController : ControllerBase
    {

        private readonly ILoggerService _LoggerService;

        public LoggerController(ILoggerService LoggerService)
        {
            _LoggerService = LoggerService;
        }

        [HttpGet]
        public async Task<IActionResult> GetChapterLesson(int pageNumber=1,int pageSize=10)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _LoggerService.GetAllLogs(pageNumber, pageSize);

            return Ok(result);
        }

        [HttpDelete("{Id}")]
        public async Task<IActionResult> DeleteLesson(int Id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var result = await _LoggerService.DeleteLog(Id);

            if (result != ResponseKeys.Success.ToString())
            {
                return BadRequest(result);
            }
            return Ok(result);
        }


    }
}
