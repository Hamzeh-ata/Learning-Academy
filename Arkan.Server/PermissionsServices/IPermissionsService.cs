using Arkan.Server.PageModels.PermissionsModels;

namespace Arkan.Server.PermissionsServices
{
    public interface IPermissionsService
    {
        Task<PermissionFormVM> GetPermissions(string RoleId);
        Task<String> AddPermissions(PermissionFormDto model);
    }
}
