namespace Arkan.Server.PageModels.PermissionsModels

{
    public class PermissionFormDto
    {
        public string RoleId { get; set; }
        public string RoleName { get; set; }
        public List<PermissionsVM> RolesCalims { get; set; }
    }
}
