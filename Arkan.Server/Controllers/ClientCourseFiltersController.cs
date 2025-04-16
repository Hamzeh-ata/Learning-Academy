using Arkan.Server.Client_Interfaces;
using Arkan.Server.Client_PageModels.Courses;
using Arkan.Server.PageModels.CourseModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Arkan.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClientCourseFiltersController : ControllerBase
    {
        private readonly IClientCourses _CourseRepository;


        public ClientCourseFiltersController(IClientCourses CourseRepository)
        {
            _CourseRepository = CourseRepository;

        }
        [HttpGet]
        public async Task<IActionResult> FilterCourses([FromQuery] ClientCourseFilterModel filters)
        {

            var result = await _CourseRepository.FilterCourses(filters);

            return Ok(result);
        }
    }
}
