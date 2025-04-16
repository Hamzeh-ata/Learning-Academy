using Arkan.Server.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Arkan.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StatsController : ControllerBase
    {

        private readonly IHomePageInterface _HomePageService;
        public StatsController(IHomePageInterface HomePageService)
        {
            _HomePageService = HomePageService;
        }

        [HttpGet]
        public async Task<IActionResult> GetStats()
        {
            var result = await _HomePageService.GetStats();

            return Ok(result);
        }


    }
}
