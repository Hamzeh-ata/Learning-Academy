using Arkan.Server.Models;
using Arkan.Server.RoleServices;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Arkan.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminRolesController : ControllerBase
    {
        private readonly IRoles _RoleService;
        public AdminRolesController(IRoles RoleService)
        {
            _RoleService = RoleService;
        }

        [HttpGet("{UserID}")]
        public async Task<IActionResult> GetAdminRoles(String UserID)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var UserRoles = await _RoleService.GetAdminRoles(UserID);

            return Ok(UserRoles);

        }
        [HttpPost]
        public async Task<IActionResult> UpdateAdminRoles(ManageAdminRolesModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var Result = await _RoleService.UpdateAdminRoles(model);

            return Ok(Result);

        }
    }
}
