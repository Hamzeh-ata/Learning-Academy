using Arkan.Server.Enums;
using Arkan.Server.Interfaces;
using Arkan.Server.Models;
using Arkan.Server.PageModels.UserPagesModels;
using Arkan.Server.PagesServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Arkan.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PagesController : ControllerBase
    {
        private readonly IPagesService _IPagesService;
        public PagesController(IPagesService IPagesService)
        {
            _IPagesService = IPagesService;
        }
        [HttpGet]
        public async Task<IActionResult> GetPages()
        {
            var UserId = await GetCurrentUserIdAsync();

            var result = await _IPagesService.GetUserPages(UserId);

            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> AddPage(AddPageDto model)
        {
            if(!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _IPagesService.AddPage(model);

            if(result.Key != ResponseKeys.Success.ToString())
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
