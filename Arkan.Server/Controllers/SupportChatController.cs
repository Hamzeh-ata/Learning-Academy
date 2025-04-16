using Arkan.Server.ClientMessagesModels;
using Arkan.Server.Interfaces;
using Arkan.Server.Messages_Interfaces;
using Arkan.Server.SupportChat_PageModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Arkan.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SupportChatController : ControllerBase
    {
        private readonly ISupportChat _SupportChatService;
        public SupportChatController(ISupportChat supportChatService)
        {
            _SupportChatService = supportChatService;
        }

     
        [HttpPost("Message")]
        public async Task<IActionResult> SendMessage([FromForm] SendSupportMessage model)
        {
            // if user id is null the user is visitor 
            var userId = await GetCurrentUserIdAsync();

            var result = await _SupportChatService.SendMessage(userId, model);

            return Ok(result);
        }
        [HttpDelete("{RoomId}")]
        public async Task<IActionResult> DeleteRoomChat(int RoomId)
        {
            var userId = await GetCurrentUserIdAsync();

            if (userId is null)
            {
                return Unauthorized();
            }

            var result = await _SupportChatService.DeleteRoomChat(userId, RoomId);

            return Ok(result);
        }

        [HttpGet("{RoomId}")]
        public async Task<IActionResult> GetRoomMessages(int RoomId)
        {
            var userId = await GetCurrentUserIdAsync();

            var result = await _SupportChatService.GetRoomMessages(userId,RoomId);

            return Ok(result);
        }
        [HttpGet("Rooms")]
        public async Task<IActionResult> GetChatSummaries()
        {
            var userId = await GetCurrentUserIdAsync();

            if (userId is null)
            {
                return Unauthorized();
            }

            var result = await _SupportChatService.GetSupportChatSummaries(userId);

            return Ok(result);
        }


        [HttpGet("UserRoom")]
        public async Task<IActionResult> GetCurrentUserChatRoom()
        {
            var userId = await GetCurrentUserIdAsync();

            if (userId is null)
            {
                return Unauthorized();
            }

            var result = await _SupportChatService.GetCurrentUserChatRoom(userId);

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
