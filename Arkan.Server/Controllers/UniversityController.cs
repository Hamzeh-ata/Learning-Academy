using Arkan.Server.Enums;
using Arkan.Server.Interfaces;
using Arkan.Server.PageModels.UnviersitesModels;
using Arkan.Server.Repository;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Arkan.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UniversityController : ControllerBase
    {

        private readonly IUniversityInterFace _UniversityService;
        public UniversityController(IUniversityInterFace UniversityService)
        {
            _UniversityService = UniversityService;

        }

        [HttpPost("")]
        public async Task<IActionResult> AddUniversity([FromForm] AddUnvierstyDto model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var result = await _UniversityService.AddUniversity(model);

            if (result.Key != ResponseKeys.Success.ToString())
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [HttpGet("")]
        public async Task<IActionResult> GetAllUniversities(int pageNumber = 1, int pageSize = 10)
        {
            var result = await _UniversityService.GetUniversities(pageNumber, pageSize);

            return Ok(result);
        }

        [HttpPut("")]
        public async Task<IActionResult> UpdateUnviersty([FromForm] UpdateUnvierstyDto model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _UniversityService.UpdateUniversity(model);

            if (result.Key != ResponseKeys.Success.ToString())
            {
                return BadRequest(result);
            }
            return Ok(result);
        }


        [HttpGet("{Id}")]
        public async Task<IActionResult> GetUnviersty(int Id)
        {
            if (Id <= 0)
            {
                return BadRequest();
            }

            var result = await _UniversityService.GetUniversity(Id);

            if (result.Key != ResponseKeys.Success.ToString())
            {
                return BadRequest(result);
            }

            return Ok(result);
        }


        [HttpDelete("{Id}")]
        public async Task<IActionResult> RemoveUnviersty(int Id)
        {
            if (Id <= 0)
            {
                return BadRequest();
            }

            var result = await _UniversityService.RemoveUniversity(Id);

            if (result != ResponseKeys.Success.ToString())
            {
                return BadRequest(result);
            }

            return Ok(result);
        }



    }
}
