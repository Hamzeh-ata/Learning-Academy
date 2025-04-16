using Arkan.Server.Client_Interfaces;
using Arkan.Server.Enums;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Arkan.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClientInstructorsController : ControllerBase
    {
        private readonly IInstructors _IInstructorsService;
        public ClientInstructorsController(IInstructors IInstructorsService)
        {
            _IInstructorsService = IInstructorsService;
        }
        [HttpGet]
        public async Task<IActionResult> GetInstructors(string? name,int pageNumber = 1 , int pageSize = 10)
        {
            var result = await _IInstructorsService.GetAllInstructors(pageNumber, pageSize, name);

            return Ok(result);
        }
    }
}
