using Arkan.Server.Enums;
using Arkan.Server.Interfaces;
using Arkan.Server.PageModels.PackageModels;
using Arkan.Server.Repository;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Arkan.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PackageController : ControllerBase
    {
        private readonly IPackageInterface _PackageService;
        public PackageController(IPackageInterface PackageService)
        {
            _PackageService = PackageService;
        }
        [HttpPost("")]
        public async Task<IActionResult> AddPackage([FromForm] AddPackageDto model)
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

            var result = await _PackageService.AddPackage(model, userId);

            if (result.Key != ResponseKeys.Success.ToString())
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [HttpGet("")]
        public async Task<IActionResult> GetAllPackages(int pageNumber = 1,int PageSize = 10)
        {
            var result = await _PackageService.GetPackages(pageNumber, PageSize);

            return Ok(result);
        }

        [HttpPut("")]
        public async Task<IActionResult> UpdatePackage([FromForm] UpdatePackageDto model)
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
            var result = await _PackageService.UpdatePackage(model, userId);

            if (result.Key != ResponseKeys.Success.ToString())
            {
                return BadRequest(result);
            }
            return Ok(result);
        }

        [HttpGet("{PackageId}")]
        public async Task<IActionResult> GetPackage(int PackageId)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _PackageService.GetPackage(PackageId);

            if (result.Key != ResponseKeys.Success.ToString())
            {
                return BadRequest(result);
            }
            return Ok(result);
        }

        [HttpDelete("{PackageId}")]
        public async Task<IActionResult> RemovePackage(int PackageId)
        {
            if (PackageId <= 0)
            {
                return BadRequest();
            }

            var result = await _PackageService.RemovePackage(PackageId);

            if(result != ResponseKeys.Success.ToString())
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
