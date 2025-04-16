namespace Arkan.Server.PageModels.UserPagesModels
{
    public class GetUserPagesDto
    {
        public bool IsAdmin { get; set; }
        public List<UserPagesDto> Pages { get; set; }
    }
    public class UserPagesDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string ComponentName { get; set; }
        public List<UserPagesPermissionsDto> Permissions { get; set; }
    }
    public class UserPagesPermissionsDto
    {
        public bool View { get; set; }
        public bool Create { get; set; }
        public bool Edit { get; set; }
        public bool Delete { get; set; }    
    }
}
