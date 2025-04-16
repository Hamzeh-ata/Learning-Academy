
namespace Arkan.Server.PageModels.PermissionsModels
{
    public class PermissionFormVM
    {
        public string RoleId { get; set; }
        public string RoleName { get; set; }
        public string ResponseKey { get; set; }
        public List<PermissionsVM> RolesCalims { get; set; }

    }
}
