using Arkan.Server.Client_Interfaces;
using Arkan.Server.Messages_Interfaces;
using Arkan.Server.ClientMessagesModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Arkan.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClientChatController : ControllerBase
    {
        private readonly IClientMessages _IClientMessagesService;
        public ClientChatController(IClientMessages IClientMessagesService)
        {
            _IClientMessagesService = IClientMessagesService;
        }

        [HttpPost("StudentInstructors")]
        public async Task<IActionResult> StartNewChat(string ReceiverId)
        {
            var userId = await GetCurrentUserIdAsync();

            if (userId is null)
            {
                return Unauthorized();
            }

            var result = await _IClientMessagesService.StartChat(userId, ReceiverId);

            return Ok(result);
        }

        [HttpGet("StudentInstructors")]
        public async Task<IActionResult> GetStudentInstructors()
        {
            var userId = await GetCurrentUserIdAsync();

            if (userId is null)
            {
                return Unauthorized();
            }

            var result = await _IClientMessagesService.GetStudentInstructors(userId);

            return Ok(result);
        }

        [HttpPost("Message")]
        public async Task<IActionResult> SendMessage([FromForm] AddClientMessages model)
        {
            var userId = await GetCurrentUserIdAsync();

            if (userId is null)
            {
                return Unauthorized();
            }

            var result = await _IClientMessagesService.SendMessage(userId, model);

            return Ok(result);
        }

        [HttpGet("Room")]
        public async Task<IActionResult> GetRoom(string userId)
        {
            var currentUserId = await GetCurrentUserIdAsync();

            if (currentUserId is null)
            {
                return Unauthorized();
            }

            var result = await _IClientMessagesService.GetStudentInstructorRoom(currentUserId, userId);

            return Ok(result);
        }

        [HttpDelete("{MessageId}")]
        public async Task<IActionResult> DeleteMessage(int MessageId)
        {
            var userId = await GetCurrentUserIdAsync();

            if (userId is null)
            {
                return Unauthorized();
            }

            var result = await _IClientMessagesService.DeleteMessage(userId, MessageId);

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

            var result = await _IClientMessagesService.GetChatSummaries(userId);

            return Ok(result);
        }

        [HttpGet("{RoomId}")]
        public async Task<IActionResult> GetRoomMessages(int RoomId)
        {
            var userId = await GetCurrentUserIdAsync();

            if (userId is null)
            {
                return Unauthorized();
            }

            var result = await _IClientMessagesService.GetRoomMessages(userId, RoomId);

            return Ok(result);
        }

        [HttpDelete("DeleteRoomChat{RoomId}")]
        public async Task<IActionResult> DeleteRoomChat(int RoomId)
        {
            var userId = await GetCurrentUserIdAsync();

            if (userId is null)
            {
                return Unauthorized();
            }

            var result = await _IClientMessagesService.DeleteRoomChat(userId, RoomId);

            return Ok(result);
        }

        [HttpPost("Reaction")]
        public async Task<IActionResult> AddReaction([FromBody] AddReaction model)
        {
            var userId = await GetCurrentUserIdAsync();

            if (userId is null)
            {
                return Unauthorized();
            }

            var result = await _IClientMessagesService.AddReaction(userId, model);

            return Ok(result);
        }

        [HttpPut("Reaction")]
        public async Task<IActionResult> UpdateReaction([FromBody] UpdateReaction model)
        {
            var userId = await GetCurrentUserIdAsync();

            if (userId is null)
            {
                return Unauthorized();
            }

            var result = await _IClientMessagesService.UpdateReaction(userId, model);

            return Ok(result);
        }

        [HttpDelete("Reaction/{ReActionId}")]
        public async Task<IActionResult> DeleteReaction(int ReActionId)
        {
            var userId = await GetCurrentUserIdAsync();

            if (userId is null)
            {
                return Unauthorized();
            }

            var result = await _IClientMessagesService.DeleteReaction(userId, ReActionId);

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

