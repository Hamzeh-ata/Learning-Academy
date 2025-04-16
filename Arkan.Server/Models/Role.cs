namespace Arkan.Server.Models
{
    public class Role: BaseModel
    {
        public string Name {  get; set; }
        public string? Description { get; set; }
        public ICollection<UsersRoles> UserRoles {  get; set; }
        public ICollection<RolePermissions> RolePermissions { get; set; }
    }
}
