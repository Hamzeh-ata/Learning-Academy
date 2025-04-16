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
    public class StudentPackagesController : ControllerBase
    {
        private readonly IStudentPackagesInterface _StudentService;
        public StudentPackagesController(IStudentPackagesInterface StudentService)
        {
            _StudentService = StudentService;
        }
        [HttpGet("")]
        public async Task<IActionResult> GetStudentPackages(string userId,int pageNumber=1, int pageSize=10)
        {
            var result = await _StudentService.GetStudentPackages(userId, pageNumber, pageSize);
            return Ok(result);
        }

        [HttpDelete("")]
        public async Task<IActionResult> DeleteStudentPackages(RemoveStudentPackagesDto model)
        {
            var result = await _StudentService.RemoveStudentPackages(model);

            if (result != ResponseKeys.Success.ToString())
            {
                return BadRequest(result);
            }

            return Ok(result);
        }
    }
}
