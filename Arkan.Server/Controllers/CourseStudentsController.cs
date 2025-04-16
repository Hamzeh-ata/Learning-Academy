using Arkan.Server.Enums;
using Arkan.Server.Interfaces;
using Arkan.Server.PageModels.CourseModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Arkan.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CourseStudentsController : ControllerBase
    {
        private readonly ICourseInterface _CourseRepository;
        public CourseStudentsController(ICourseInterface CourseRepository)
        {
            _CourseRepository = CourseRepository;
        }
        [HttpGet("{CourseId}")]
        public async Task<IActionResult> GetEnrolledStudents(int CourseId, int pageNumber=1, int pageSize=10)
        {
            if (CourseId == 0)
            {
                return BadRequest();
            }
            var result = await _CourseRepository.GetEnrolledStudents(pageNumber,pageSize,CourseId);

            return Ok(result);
        }

        [HttpDelete("")]
        public async Task<IActionResult> RemoveStudentsFromCourse(RemoveCourseStudentsDto model)
        {
            var result = await _CourseRepository.RemoveStudentsFromCourse(model);

            if (result != ResponseKeys.Success.ToString())
            {
                return BadRequest(result);
            }
            return Ok(result);
        }



    }
}
