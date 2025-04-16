using Arkan.Server.Enums;
using Arkan.Server.Interfaces;
using Arkan.Server.PageModels.HomePageModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Arkan.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InstructorsSectionController : ControllerBase
    {
        private readonly IHomePageInterface _HomePageService;
        public InstructorsSectionController(IHomePageInterface HomePageService)
        {
            _HomePageService = HomePageService;
        }


        [HttpGet]
        public async Task<IActionResult> GetInstructorsSection()
        {

            var result = await _HomePageService.GetInstructorsSection();

            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> AddInstructorToSection([FromForm] AddInstructorSection model)
        {

            var result = await _HomePageService.AddInstructorToSection(model);

            if (result.Key != ResponseKeys.Success.ToString())

            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [HttpDelete]
        public async Task<IActionResult> RemoveInstructorFromSection(int itemId)
        {

            var result = await _HomePageService.RemoveInstructorFromSection(itemId);

            if (result != ResponseKeys.Success.ToString())

            {
                return BadRequest(result);
            }

            return Ok(result);
        }


    }
}
