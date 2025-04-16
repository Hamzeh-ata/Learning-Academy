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
    public class NonStudentPackagesController : ControllerBase
    {
        private readonly IStudentPackagesInterface _StudentService;
        public NonStudentPackagesController(IStudentPackagesInterface StudentService)
        {
            _StudentService = StudentService;
        }


        [HttpGet("")]
        public async Task<IActionResult> GetNonStudentPackages(string userId, int pageNumber = 1, int pageSize = 10)
        {
            var result = await _StudentService.GetNonStudentPackages(userId, pageNumber, pageSize);
            return Ok(result);
        }

        [HttpPost("")]
        public async Task<IActionResult> AddStudentPackages(AddStudentPackagesDto model)
        {
            var result = await _StudentService.AddStudentPackages(model);

            if (result != ResponseKeys.Success.ToString())
            {
                return BadRequest(result);
            }

            return Ok(result);
        }





    }
}
