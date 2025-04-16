using Arkan.Server.Enums;
using Arkan.Server.Interfaces;
using Arkan.Server.PageModels.InstructorModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Arkan.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InstructorCoursesController : ControllerBase
    {
        private readonly IInstructorInterface _InstructorInterface;

        public InstructorCoursesController(IInstructorInterface InstructorService)
        {
            _InstructorInterface = InstructorService;
        }
        [HttpPost()]
        public async Task<IActionResult> AddCourseInstructor([FromBody] InstructorCoursesManage model)
        {
            if (string.IsNullOrEmpty(model.UserId) || model.CoursesIds == null || !model.CoursesIds.Any())
            {
                return BadRequest();
            }
            var result = await _InstructorInterface.AddCoursesToInstructor(model);
            if (result != ResponseKeys.Success.ToString())
            {
                return BadRequest(result);
            }
            return Ok(result);
        }


        [HttpGet("{UserId}")]
        public async Task<IActionResult> InstructorCourses(string UserId, int pageNumber = 1, int pageSize = 10)
        {
            if (UserId is null)
            {
                return BadRequest(ModelState);
            }
            var result = await _InstructorInterface.InstructorCourses(pageNumber, pageSize, UserId);

            return Ok(result);
        }

        [HttpGet("NoneInstructorCourses{UserId}")]
        public async Task<IActionResult> CoursesNotTaughtByInstructor(string UserId, int pageNumber = 1, int pageSize = 10)
        {
            if (UserId is null)
            {
                return BadRequest(ModelState);
            }
            var result = await _InstructorInterface.CoursesNotTaughtByInstructor(pageNumber, pageSize,UserId);
            return Ok(result);
        }

        [HttpDelete("")]
        public async Task<IActionResult> RemoveCourseInstructor([FromBody] InstructorCoursesManage model)
        {
            if (string.IsNullOrEmpty(model.UserId) || model.CoursesIds == null || !model.CoursesIds.Any())
            {
                return BadRequest();
            }
            var result = await _InstructorInterface.RemoveCoursesFromInstructor(model);
            if (result != ResponseKeys.Success.ToString())
            {
                return BadRequest(result);
            }
            return Ok(result);
        }

    }
}
