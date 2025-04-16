using System.Security.Cryptography.X509Certificates;
using Arkan.Server.PageModels.RolesModels;

namespace Arkan.Server.Models
{
    public class UserRolesModel
    {
        public string UserID { get; set; }
        public string Email { get; set; }
        public string Key { get; set; }
        public List<RoleDTO> Roles { get; set; }


    }
}
