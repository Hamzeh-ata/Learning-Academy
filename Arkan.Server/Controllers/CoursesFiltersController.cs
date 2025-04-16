using Arkan.Server.Helpers;
using Arkan.Server.Interfaces;
using Arkan.Server.PageModels.CourseModels;
using Arkan.Server.Repository;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static NuGet.Packaging.PackagingConstants;

namespace Arkan.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CoursesFiltersController : ControllerBase
    {
        private readonly ICourseInterface _CourseRepository;


        public CoursesFiltersController(ICourseInterface CourseRepository)
        {
            _CourseRepository = CourseRepository;

        }
        [HttpGet]
        public async Task<IActionResult> FilterCourses([FromQuery] CourseFilterModel filters) { 

         var result =  await _CourseRepository.FilterCourses(filters);  

         return Ok(result);
        }

    }
}
