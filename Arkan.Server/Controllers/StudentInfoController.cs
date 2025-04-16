using Arkan.Server.Enums;
using Arkan.Server.Interfaces;
using Arkan.Server.Models;
using Arkan.Server.PageModels.StudentModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Arkan.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudentInfoController : ControllerBase
    {

        private readonly IStudentInterface _StudentService;
        public StudentInfoController(IStudentInterface StudentService)
        {
            _StudentService = StudentService;
        }

        [HttpPost("")]
        public async Task<IActionResult> AddStudentInformationAsync([FromForm] StudentInformation model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var result = await _StudentService.AddStudentInfoAsync(model);

            if (result.Key != ResponseKeys.Success.ToString())
            {
                return BadRequest(result);
            }
            return Ok(result);
        }

        [HttpPut("")]
        public async Task<IActionResult> UpdateStudentInformationAsync([FromForm] StudentInformation model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _StudentService.UpdateStudentInfoAsync(model);

            if (result.Key != ResponseKeys.Success.ToString())
            {
                return BadRequest(result);
            }
            return Ok(result);
        }

        [HttpGet("{userId}")]
        public async Task<IActionResult> GetStudentInformationAsync(string userId)
        {
            if (userId is null)
            {
                return BadRequest(ModelState);
            }

            var result = await _StudentService.GetStudentInfoAsync(userId);

            if (result.Key != ResponseKeys.Success.ToString())
            {
                return BadRequest(result);
            }
            return Ok(result);
        }


    }
}
