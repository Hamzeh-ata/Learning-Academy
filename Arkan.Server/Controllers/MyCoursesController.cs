using Arkan.Server.Client_Interfaces;
using Arkan.Server.Interfaces;
using Arkan.Server.Repository;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Arkan.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MyCoursesController : ControllerBase
    {
        private readonly IMyCourses _MyCoursesService;
        public MyCoursesController(IMyCourses MyCoursesService)
        {
            _MyCoursesService = MyCoursesService;

        }

        [HttpGet]
        public async Task<IActionResult> GetCourses(int pageNumber = 1, int pageSize = 10)
        {
            var userId = await GetCurrentUserIdAsync();
            
            if (userId is null)
            {
                return Unauthorized();
            }

            var result = await _MyCoursesService.GetUserCourses(userId,pageNumber, pageSize);

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
