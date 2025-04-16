namespace Arkan.Server.PageModels.AuthModels
{
    public class UserPages
    {
        public int PageId { get; set; }
        public string PageName { get; set; }
        public List<string> Permissions { get; set; }
        public string RoleName { get; set; }
    }
}
