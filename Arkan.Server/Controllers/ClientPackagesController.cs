using Arkan.Server.Client_Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Arkan.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClientPackagesController : ControllerBase
    {

        private readonly IClientPackages _IClientPackagesService;
        public ClientPackagesController(IClientPackages IClientPackagesService)
        {
            _IClientPackagesService = IClientPackagesService;
        }
        [HttpGet]
        public async Task<IActionResult> GetPackages(string? name, int pageNumber = 1, int pageSize = 10)
        {
            var result = await _IClientPackagesService.GetPackages(pageNumber, pageSize, name);

            return Ok(result);
        }

        [HttpGet("{PackageId}")]
        public async Task<IActionResult> GetPackages(int PackageId)
        {
            var userId = await GetCurrentUserIdAsync();

             var result = await _IClientPackagesService.GetPackage(PackageId, userId);

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
