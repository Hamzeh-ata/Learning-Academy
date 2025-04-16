using Arkan.Server.Models;
using Arkan.Server.PageModels.RolesModels;
using Arkan.Server.RoleServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Arkan.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RolesController : ControllerBase
    {
        private readonly IRoles _RoleService;

        public RolesController(IRoles RoleService)
        {
            _RoleService = RoleService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllRoles()
        {
            var Roles = await _RoleService.GetAllRoles();
            return Ok(Roles);
        }

        [HttpPost]
        public async Task<IActionResult> AddRole(AddRoleModel model)
        {
            var Roles = await _RoleService.AddRole(model);
            return Ok(Roles);
        }
        [HttpPut]
        public async Task<IActionResult> UpdateRole(UpdateRoleModel model)
        {
            var Roles = await _RoleService.UpdateRole(model);
            return Ok(Roles);
        }
        [HttpDelete("{RoleId}")]
        public async Task<IActionResult> DeleteRole(int RoleId)
        {
            var Roles = await _RoleService.DeleteRole(RoleId);
            return Ok(Roles);
        }




    }
}
