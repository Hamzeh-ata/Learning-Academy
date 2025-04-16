using Arkan.Server.Enums;
using Arkan.Server.Interfaces;
using Arkan.Server.PageModels.HomePageModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Arkan.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CompanyInfoController : ControllerBase
    {
        private readonly IHomePageInterface _HomePageService;
        public CompanyInfoController(IHomePageInterface HomePageService)
        {
            _HomePageService = HomePageService;
        }

        [HttpGet]
        public async Task<IActionResult> GetCompanyInfo()
        {

            var result = await _HomePageService.GetCompanyInfo();

            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> AddCompanyInfo([FromForm] AddCompanyInfo model)
        {

            var result = await _HomePageService.AddCompanyInfo(model);

            if (result.Key != ResponseKeys.Success.ToString())

            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateCompanyInfo([FromForm] UpdateCompanyInfo model)
        {

            var result = await _HomePageService.UpdateCompanyInfo(model);

            if (result.Key != ResponseKeys.Success.ToString())

            {
                return BadRequest(result);
            }

            return Ok(result);
        }

    }
}
