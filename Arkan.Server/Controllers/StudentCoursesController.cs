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
    public class StudentCoursesController : ControllerBase
    {
        private readonly IStudentInterface _StudentService;
        public StudentCoursesController(IStudentInterface StudentService)
        {
            _StudentService = StudentService;
        }
        [HttpGet("{UserId}")]
        public async Task<IActionResult> GetStudentCoursesAsync(string UserId, int pageNumber = 1, int pageSize = 10)
        {
            var result = await _StudentService.GetStudentCourses(pageNumber,pageSize, UserId);

            return Ok(result);
        }


        [HttpPost("")]
        public async Task<IActionResult> AddStudentCourses([FromBody] AddCoursesToStudent model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var result = await _StudentService.AddCoursesToStudent(model);
            if (result != ResponseKeys.Success.ToString())
            {
                return BadRequest(result);
            }
            return Ok(result);
        }


        [HttpPost("Remove")]
        public async Task<IActionResult> RemoveStudentFromCourses([FromBody] RemoveStudentFromCourses model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var result = await _StudentService.RemoveStudentFromCourses(model);
            if (result != ResponseKeys.Success.ToString())
            {
                return BadRequest(result);
            }
            return Ok(result);
        }



        [HttpGet("Non-Enrolled-Courses")]
        public async Task<IActionResult> GetCoursesNotEnrolledByStudent(string UserId,int pageNumber = 1, int pageSize = 10)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var result = await _StudentService.GetCoursesNotEnrolledByStudent(pageNumber,pageSize, UserId);

            return Ok(result);
        }
    }
}
