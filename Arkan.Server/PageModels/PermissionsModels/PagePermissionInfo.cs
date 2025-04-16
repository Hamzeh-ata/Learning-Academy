namespace Arkan.Server.PageModels.PermissionsModels
{
    public class PagePermissionInfo
    {
        public string PageName { get; set; }
        public int PageId {  get; set; }

        public List<int> Permissions { get; set; }
    }

    public class RolePermissionsResult
    {
        public List<PagePermissionInfo> PagePermissions { get; set; }
        public List<PermissionsDto> Permissions { get; set; }
        public string Key {  get; set; }
    }

    public class PermissionsDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
    } 

}
