using Arkan.Server.Enums;
using Arkan.Server.Interfaces;
using Arkan.Server.Models;
using Arkan.Server.PageModels.ArkanCodesModels;
using Arkan.Server.PageModels.PromoCodes;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Arkan.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ArkanCodeController : ControllerBase
    {
        private readonly IArkanCode _IArkanCodeService;
        public ArkanCodeController(IArkanCode IArkanCodeService)
        {
            _IArkanCodeService = IArkanCodeService;
        }
        [HttpPost("")]
        public async Task<IActionResult> AddArkanCode(AddArkanCode model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var result = await _IArkanCodeService.AddArkanCode(model);

            if (result.Key != ResponseKeys.Success.ToString())
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [HttpGet("")]
        public async Task<IActionResult> GetArkanCodes()
        {
            var result = await _IArkanCodeService.GetArkanCodes();

            return Ok(result);
        }

        [HttpPut("")]
        public async Task<IActionResult> UpdateArkanCode(UpdateArkanCode model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _IArkanCodeService.UpdateArkanCode(model);

            if (result.Key != ResponseKeys.Success.ToString())
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [HttpGet("{Id}")]
        public async Task<IActionResult> GetArkanCode(int Id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _IArkanCodeService.GetArkanCode(Id);

            if (result.Key != ResponseKeys.Success.ToString())
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [HttpDelete("{Id}")]
        public async Task<IActionResult> RemoveArkanCode(int Id)
        {
            if (Id <= 0)
            {
                return BadRequest();
            }

            var result = await _IArkanCodeService.RemoveArkanCode(Id);

            if (result != ResponseKeys.Success.ToString())
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [HttpGet("GenerateNumber")]
        public async Task<IActionResult> GenerateNumber()
        {
            var result = await _IArkanCodeService.GenerateNumber();

            return Ok(result);
        }

    }
}
