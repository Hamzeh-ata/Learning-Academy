using Arkan.Server.Client_Interfaces;
using Arkan.Server.Client_PageModels.DropDown;
using Arkan.Server.Client_Repositories;
using Arkan.Server.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Arkan.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DropDownController : ControllerBase
    {
        private readonly IDropDown _DropDownService;
        public DropDownController(IDropDown DropDownRepository)
        {
            _DropDownService = DropDownRepository;
        }

        [HttpPost]
        public async Task<IActionResult> GetDropDown(GetDropDown model)
        {

            var result = await _DropDownService.GetData(model);

            return Ok(result);
        }

    }
}
