namespace Arkan.Server.Models
{
    public class PagePermissions : BaseModel
    {
        public int PageId {  get; set; }
        public Page Page { get; set; }
        public int PermissionsId {  get; set; }
        public Permissions Permissions { get; set; }
        public int RoleId { get; set; }
        public Role Role { get; set; }

    }
}
