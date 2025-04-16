using Arkan.Server.Models;
using Arkan.Server.PageModels.RolesModels;
namespace Arkan.Server.RoleServices
{
    public interface IRoles
    {
        Task<RolesModelDto> GetAllRoles();
        Task<UserRolesModel> GetAdminRoles(string UserId);
        Task<UpdatedAdminRole> UpdateAdminRoles(ManageAdminRolesModel model);
        Task<AddedRoleModel> AddRole(AddRoleModel model);
        Task<UpdateRolesModel> UpdateRole(UpdateRoleModel model);
        Task<string> DeleteRole(int RoleId);
        Task<Role> FindRoleByName(string Name);
        Task<Role> FindRoleById(int id);
        Task<List<Dictionary<string, object>>> FindUserRolesList(string UserId);
        Task<List<Dictionary<string, object>>> FindAdminRolesList(string UserId);
        Task<List<string>> FindUserRolesNames(string UserId);
        Task<List<Role>> FindUserRoles(string userId);
        Task<string> FindUserRole(string UserId);

    }
}
