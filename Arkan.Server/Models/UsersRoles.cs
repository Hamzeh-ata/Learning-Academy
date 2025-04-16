namespace Arkan.Server.Models
{
    public class UsersRoles : BaseModel
    {
        public int RoleId { get; set; }
        public Role Role { get; set; }
        public string UserId {  get; set; }
        public ApplicationUser User { get; set; }
    }
}
