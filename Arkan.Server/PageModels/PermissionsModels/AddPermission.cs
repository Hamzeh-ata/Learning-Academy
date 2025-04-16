using System.ComponentModel.DataAnnotations;

namespace Arkan.Server.PageModels.PermissionsModels
{
    public class AddPermission
    {
        [Required]
        public int RoleId {  get; set; }
        public List<AddPagePermissions> Permissions { get; set; }
    }
    public class PermissionsIds
    {
        public int PermissionId { get; set;}
    }
    public class AddPagePermissions
    {
        public int PageId { get; set; }
        public List<int> PermissionIds { get; set; }
    }
}
