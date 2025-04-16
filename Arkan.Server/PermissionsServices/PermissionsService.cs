using Arkan.Server.Enums;
using Arkan.Server.Models;
using Arkan.Server.PageModels.PermissionsModels;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;

namespace Arkan.Server.PermissionsServices
{
    public class PermissionsService: IPermissionsService
    {

        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly UserManager<ApplicationUser> _UserManager;
        public PermissionsService(RoleManager<IdentityRole> roleManager, UserManager<ApplicationUser> UserManager)
        {
            _roleManager = roleManager;
            _UserManager = UserManager;
        }

        public async Task<PermissionFormVM> GetPermissions(string RoleId)
        {
            var PermissionsForm = new PermissionFormVM();
            var Role = await _roleManager.FindByIdAsync(RoleId);

            if (Role is null)
            {
                PermissionsForm.ResponseKey = ResponseKeys.RoleNotFound.ToString();
                return PermissionsForm;
            }

            //Get All Clamis for the role
            var RoleClaims = _roleManager.GetClaimsAsync(Role).Result.Select(role => role.Value).ToList();

            //Get all Permissions
            var allClaims = PageModels.PermissionsModels.Permissions.GenerateAllPermissions();

            var AllPermissions = allClaims.Select(Claim => new PermissionsVM
            {

                DisplayValue = Claim

            }).ToList();

            //Loop in all AllPermissions and check if their any perrmission is exists in RoleClaims then make it selected 
            foreach (var permission in AllPermissions)
            {
                if (RoleClaims.Any(Claim => Claim == permission.DisplayValue))
                    permission.IsSelected = true;
            }

            PermissionsForm = new PermissionFormVM
            {
                RolesCalims = AllPermissions,
                RoleId = RoleId,
                RoleName = Role.Name,
                ResponseKey = ResponseKeys.Success.ToString(),
            };

            return PermissionsForm;
        }

        public async Task<String> AddPermissions(PermissionFormDto model)
        {
            var PermissionsForm = new PermissionFormVM();
            var Role = await _roleManager.FindByIdAsync(model.RoleId);

            if (Role is null)
            {
                return ResponseKeys.RoleNotFound.ToString();

            }
            //Get All Clamis for the role
            var RoleClaims = await _roleManager.GetClaimsAsync(Role);

            foreach (var Claim in RoleClaims)
            {
                await _roleManager.RemoveClaimAsync(Role, Claim);

            }

            var SelectedClaims = model.RolesCalims.Where(Claim => Claim.IsSelected).ToList();

            foreach (var item in SelectedClaims)
            {
                await _roleManager.AddClaimAsync(Role, new Claim(ClaimsTypes.Permission.ToString(), item.DisplayValue));
            }

            return ResponseKeys.Success.ToString();
        }
    }
}
