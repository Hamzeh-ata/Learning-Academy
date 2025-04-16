namespace Arkan.Server.Models
{
    public class RolePermissions : BaseModel
    {

        public int RoleId { get; set; }
        public Role Role { get; set; }
        public int PermissionsId {  get; set; }
        public Permissions Permissions { get; set; }

    }
}
