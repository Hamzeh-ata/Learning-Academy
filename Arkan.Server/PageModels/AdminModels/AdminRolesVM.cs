
using Arkan.Server.PageModels.RolesModels;

namespace Arkan.Server.PageModels.AdminModels
{
    public class AdminRolesVM
    {
        public string UserID { get; set; }
        public string UserName { get; set; }
        public List<RoleDTO> Roles { get; set; }
    }
}
