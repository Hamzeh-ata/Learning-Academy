using Arkan.Server.Client_Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Arkan.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InstructorPublicProfileController : ControllerBase
    {
        private readonly IInstructorPublicProfile _IProfileService;
        public InstructorPublicProfileController(IInstructorPublicProfile ProfileService)
        {
            _IProfileService = ProfileService;
        }

        [HttpGet("{InstructorId}")]
        public async Task<IActionResult> GetProfile(int InstructorId)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _IProfileService.GetProfileAsync(InstructorId);

            return Ok(result);
        }
    }
}
