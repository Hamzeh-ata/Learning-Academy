using System.Security.Cryptography.X509Certificates;

namespace Arkan.Server.PageModels.RolesModels
{
    public class RoleDTO
    {
        public string RoleName { get; set; }
        public int RoleId { get; set; }
        public bool IsSelected { get; set; }
    }
}
