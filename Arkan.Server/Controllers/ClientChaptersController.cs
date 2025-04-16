using Arkan.Server.Client_Interfaces;
using Arkan.Server.Enums;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Arkan.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClientChaptersController : ControllerBase
    {

        private readonly IClientChapters _ClientChapterssService;
        public ClientChaptersController(IClientChapters ClientChapterssService)
        {
            _ClientChapterssService = ClientChapterssService;
        }

        [HttpGet("{CourseId}")]
        public async Task<IActionResult> GetChapters(int CourseId)
        {
            var userId = await GetCurrentUserIdAsync();

            var result = await _ClientChapterssService.GetChapters(CourseId, userId ?? null);

            return Ok(result);
        }

        private async Task<string> GetCurrentUserIdAsync()
        {

            if (!User.Identity.IsAuthenticated)
            {
                return null;
            }

            var userId = User.FindFirst("uid")?.Value;

            return userId;
        }
    }
}
