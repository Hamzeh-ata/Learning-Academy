using Arkan.Server.PageModels.AdminModels;

namespace Arkan.Server.Models
{
    public class ManageAdminRolesModel
    {
        public string UserID { get; set; }

        public List<AddAdminRolesDto> Roles { get; set; }
    }
}
