using Arkan.Server.ClientMessagesModels;
using Arkan.Server.Enums;
using Arkan.Server.Messages_Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Arkan.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CourseChatRoomController : ControllerBase
    {
        private readonly IChatRoom _IChatRoomService;
        public CourseChatRoomController(IChatRoom IChatRoomService)
        {
            _IChatRoomService = IChatRoomService;
        }
        [HttpPost("Message")]
        public async Task<IActionResult> SendMessage([FromForm] SendRoomMessage model)
        {
            var userId = await GetCurrentUserIdAsync();

            if (userId is null)
            {
                return Unauthorized();
            }

            var result = await _IChatRoomService.SendMessage(userId, model);

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

            var result = await _IChatRoomService.DeleteMessage(userId, MessageId);

            if (result != ResponseKeys.Success.ToString())
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [HttpGet("{RoomId}")]
        public async Task<IActionResult> GetRoomMessages(int RoomId, int pageNumber = 1, int pageSize = 20)
        {
            // the room will created when create a course each course has a room

            var userId = await GetCurrentUserIdAsync();

            if (userId is null)
            {
                return Unauthorized();
            }

            var result = await _IChatRoomService.GetRoomMessages(userId, RoomId, pageNumber,pageSize);

            return Ok(result);
        }

        [HttpGet("GetUserRooms")]
        public async Task<IActionResult> GetUserCourseRooms()
        {
            var userId = await GetCurrentUserIdAsync();

            if (userId is null)
            {
                return Unauthorized();
            }

            var result = await _IChatRoomService.GetUserCourseRooms(userId);

            return Ok(result);
        }

        [HttpGet("GetRoomUsers{RoomId}")]
        public async Task<IActionResult> GetRoomUsers(int RoomId)
        {
            var userId = await GetCurrentUserIdAsync();

            if (userId is null)
            {
                return Unauthorized();
            }
            var result = await _IChatRoomService.GetRoomUsers(RoomId, userId);

            return Ok(result);
        }

        [HttpGet("GetRoomAttachments{RoomId}")]
        public async Task<IActionResult> GetRoomAttachments(int RoomId)
        {
            var result = await _IChatRoomService.GetRoomAttachments(RoomId);

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

            var result = await _IChatRoomService.AddReaction(userId, model);

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

            var result = await _IChatRoomService.UpdateReaction(userId, model);

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

            var result = await _IChatRoomService.DeleteReaction(userId, ReActionId);

            return Ok(result);
        }

        [HttpPost("Mute")]
        public async Task<IActionResult> MuteStudent(int roomId, string studentUserId)
        {
            var userId = await GetCurrentUserIdAsync();

            if (userId is null)
            {
                return Unauthorized();
            }

            var result = await _IChatRoomService.MuteStudent(roomId, userId, studentUserId);

            return Ok(result);
        }

        [HttpPost("UnMute")]
        public async Task<IActionResult> UnMuteStudent(int roomId, string studentUserId)
        {
            var userId = await GetCurrentUserIdAsync();

            if (userId is null)
            {
                return Unauthorized();
            }

            var result = await _IChatRoomService.UnMuteStudent(roomId, userId, studentUserId);

            return Ok(result);
        }

        [HttpPost("AdminMute")]
        public async Task<IActionResult> AdminMuteStudent(int roomId, string studentUserId)
        {
            var result = await _IChatRoomService.MuteStudent(roomId, studentUserId);

            return Ok(result);
        }

        [HttpPost("AdminUnMute")]
        public async Task<IActionResult> AdminUnMuteStudent(int roomId, string studentUserId)
        {
            var result = await _IChatRoomService.UnMuteStudent(roomId,studentUserId);

            return Ok(result);
        }

        [HttpGet("GetAllRooms")]
        public async Task<IActionResult> GetAllRooms()
        {
            var result = await _IChatRoomService.GetAllCourseRooms();

            return Ok(result);
        }

        [HttpGet("GetAllRoomUsers{RoomId}")]

        public async Task<IActionResult> GetAllRoomUsers(int RoomId)
        {
            var result = await _IChatRoomService.GetAllRoomUsers(RoomId);

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
