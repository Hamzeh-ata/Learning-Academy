using Arkan.Server.Enums;
using Arkan.Server.Interfaces;
using Arkan.Server.PageModels.InstructorModels;
using Microsoft.AspNetCore.Mvc;

namespace Arkan.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InstructorInfoController : ControllerBase
    {
        private readonly IInstructorInterface _InstructorInterface;
 
        public InstructorInfoController(IInstructorInterface InstructorService)
        {
            _InstructorInterface = InstructorService;
           
        }

        [HttpGet("")]
        public async Task<IActionResult> GetInstructorInformation(string UserId)
        {
            if (UserId is null)
            {
                return BadRequest(ModelState);
            }
            var result = await _InstructorInterface.GetInstructorInformationAsync(UserId);
            if(result.Key != ResponseKeys.Success.ToString())
            {
                return BadRequest(result);
            }
            return Ok(result);
        }

        [HttpPost("")]
        public async Task<IActionResult> AddInstructorInformation([FromForm] InstructorInformaitionDto model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var result = await _InstructorInterface.AddInstructorInformationAsync(model);
            if (result.Key != ResponseKeys.Success.ToString())
            {
                return BadRequest(result);
            }
            return Ok(result);
        }
        [HttpPut()]
        public async Task<IActionResult> UpdateInstructorInformation([FromForm] InstructorInformaitionDto model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var result = await _InstructorInterface.UpdateInstructorInformationAsync(model);

            if (result.Key != ResponseKeys.Success.ToString())
            {
                return BadRequest(result);
            }
            return Ok(result);
        }




    }
}
