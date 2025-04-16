using Arkan.Server.PageModels.PermissionsModels;

namespace Arkan.Server.RoleServices
{
    public interface IRolePagePermission
    {
        Task<RolePermissionsResult> GetPageAndPermissionsForRoleAsync(int roleId);
        Task<string> AddPagesPermissions(AddPermission model);
    }
}
