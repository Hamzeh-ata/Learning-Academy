using Arkan.Server.Enums;
using Arkan.Server.Interfaces;
using Arkan.Server.PageModels.HomePageModels;
using Arkan.Server.Repository;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Arkan.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HeroSectionController : ControllerBase
    {
        private readonly IHomePageInterface _HomePageService;
        public HeroSectionController(IHomePageInterface HomePageService)
        {
            _HomePageService = HomePageService;
        }

        [HttpGet]
        public async Task<IActionResult> GetHeroSection()
        {
            
            var result = await _HomePageService.GetHeroSection();

            if (result.Key != ResponseKeys.Success.ToString())
 
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> AddHeroSection([FromForm] AddHeroSection model)
        {

            var result = await _HomePageService.AddHeroSection(model);

            if (result.Key != ResponseKeys.Success.ToString())

            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateHeroSection([FromForm] UpdateHeroSection model)
        {

            var result = await _HomePageService.UpdateHeroSection(model);

            if (result.Key != ResponseKeys.Success.ToString())

            {
                return BadRequest(result);
            }

            return Ok(result);
        }

    }
}
