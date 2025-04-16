using Arkan.Server.Enums;
using Arkan.Server.Interfaces;
using Arkan.Server.PageModels.HomePageModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Arkan.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UniversitiesSectionController : ControllerBase
    {
        private readonly IHomePageInterface _HomePageService;
        public UniversitiesSectionController(IHomePageInterface HomePageService)
        {
            _HomePageService = HomePageService;
        }

        [HttpGet]
        public async Task<IActionResult> GetUniversitiesSection()
        {

            var result = await _HomePageService.GetUniversitiesSection();

            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> AddUniversityToSection([FromForm] AddUniversitySection model)
        {

            var result = await _HomePageService.AddUniversityToSection(model);

            if (result.Key != ResponseKeys.Success.ToString())

            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [HttpDelete]
        public async Task<IActionResult> RemoveUniversityFromSection(int itemId)
        {

            var result = await _HomePageService.RemoveUniversityFromSection(itemId);

            if (result != ResponseKeys.Success.ToString())

            {
                return BadRequest(result);
            }

            return Ok(result);
        }


    }
}
