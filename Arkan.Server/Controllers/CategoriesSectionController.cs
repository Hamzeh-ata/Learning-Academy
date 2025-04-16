using Arkan.Server.Enums;
using Arkan.Server.Interfaces;
using Arkan.Server.PageModels.HomePageModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Arkan.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesSectionController : ControllerBase
    {
        private readonly IHomePageInterface _HomePageService;
        public CategoriesSectionController(IHomePageInterface HomePageService)
        {
            _HomePageService = HomePageService;
        }
        [HttpGet]
        public async Task<IActionResult> GetCategorySection()
        {

            var result = await _HomePageService.getCategoriesSection();

            return Ok(result);
        }
        [HttpPost]
        public async Task<IActionResult> AddCategoryToSection([FromForm] AddCategorySection model)
        {

            var result = await _HomePageService.AddCategoryToSection(model);

            if (result.Key != ResponseKeys.Success.ToString())

            {
                return BadRequest(result);
            }

            return Ok(result);
        }
        [HttpDelete]
        public async Task<IActionResult> RemoveCategoryFromSection(int ItemId)
        {

            var result = await _HomePageService.RemoveCategoryFromSection(ItemId);

            if (result != ResponseKeys.Success.ToString())

            {
                return BadRequest(result);
            }

            return Ok(result);
        }
    }
}
