using Arkan.Server.Data;
using Arkan.Server.PageModels.PermissionsModels;
using Arkan.Server.RoleServices;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Arkan.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RolePagesPermissionsController : ControllerBase
    {
        private readonly IRolePagePermission _IRolePagePermission;
        public RolePagesPermissionsController(IRolePagePermission IRolePagePermission)
        {
            _IRolePagePermission = IRolePagePermission;
        }

        [HttpGet("{RoleId}")]
        public async Task<IActionResult> GetRolesPermissions(int RoleId)
        {
            if(RoleId <= 0) {

            return BadRequest();

            }
            var result = await _IRolePagePermission.GetPageAndPermissionsForRoleAsync(RoleId);

            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> AddtRolesPermissions(AddPermission model)
        {
           if (!ModelState.IsValid) {
                
            return BadRequest(ModelState);

           }
            var result = await _IRolePagePermission.AddPagesPermissions(model);

            return Ok(result);
        }



    }
}
