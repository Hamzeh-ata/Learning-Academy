using Arkan.Server.Client_Interfaces;
using Arkan.Server.Client_PageModels.LiveSessions;
using Arkan.Server.Enums;
using Microsoft.AspNetCore.Mvc;

namespace Arkan.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LiveController : ControllerBase
    {
        private readonly ILiveSession _LiveService;
        public LiveController(ILiveSession LiveService)
        {
            _LiveService = LiveService;

        }

        [HttpPost]
        public async Task<IActionResult> AddLive([FromBody] LiveDto model)
        {
            var userId = await GetCurrentUserIdAsync();

            if (userId is null)
            {
                return Unauthorized();
            }

            var result = await _LiveService.Add(model, userId);

            if (result.Key != ResponseKeys.Success.ToString())

            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateLive([FromBody] LiveDto model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);

            }

            var userId = await GetCurrentUserIdAsync();

            if (userId is null)
            {
                return Unauthorized();
            }

            var result = await _LiveService.Update(model, userId);

            if (result.Key != ResponseKeys.Success.ToString())
            {
                return BadRequest(result);
            }

            return Ok(result);

        }

        [HttpDelete("{LiveId}")]
        public async Task<IActionResult> RemoveLive(int LiveId)
        {
            var userId = await GetCurrentUserIdAsync();

            if (userId is null)
            {
                return Unauthorized();
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);

            }

            var result = await _LiveService.Delete(LiveId, userId);

            if (result != ResponseKeys.Success.ToString())
            {
                return BadRequest(result);
            }

            return Ok(result);

        }

        [HttpGet()]
        public async Task<IActionResult> GetUserLives()
        {

            var userId = await GetCurrentUserIdAsync();

            if (userId is null)
            {
                return Unauthorized();
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _LiveService.GetUserLives(userId);

            return Ok(result);

        }

        [HttpGet("{LiveId}")]
        public async Task<IActionResult> GetLiveById(int LiveId)
        {

            var userId = await GetCurrentUserIdAsync();

            if (userId is null)
            {
                return Unauthorized();
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _LiveService.GetLiveById(LiveId, userId);

            return Ok(result);

        }

        [HttpPost("ToggleLive")]
        public async Task<IActionResult> ToggleLive(int liveId,LiveSessionStatus status, bool notifyUsers, string meetingId)
        {
            var userId = await GetCurrentUserIdAsync();

            if (userId is null)
            {
                return Unauthorized();
            }

            var result = await _LiveService.ToggleLive(liveId, meetingId, status, notifyUsers, userId);

            if (result != ResponseKeys.Success.ToString())

            {
                return BadRequest(result);
            }

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
