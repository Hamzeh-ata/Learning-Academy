using Arkan.Server.Enums;
using Arkan.Server.Interfaces;
using Arkan.Server.PageModels.HomePageModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Arkan.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CoursesSectionController : ControllerBase
    {
        private readonly IHomePageInterface _HomePageService;
        public CoursesSectionController(IHomePageInterface HomePageService)
        {
            _HomePageService = HomePageService;
        }

        [HttpGet]
        public async Task<IActionResult> GetCoursesSection()
        {

            var result = await _HomePageService.GetCourseSections();

            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> AddCourseToSection([FromForm] AddCoursesSection model)
        {

            var result = await _HomePageService.AddCoursesSection(model);

            if (result.Key != ResponseKeys.Success.ToString())

            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [HttpDelete]
        public async Task<IActionResult> RemoveCourseFromSection(int itemId)
        {

            var result = await _HomePageService.RemoveCoursesSection(itemId);

            if (result != ResponseKeys.Success.ToString())

            {
                return BadRequest(result);
            }

            return Ok(result);
        }
    }
}
