
using Arkan.Server.PageModels.AdminModels;
using Arkan.Server.StudentModels;

namespace Arkan.Server.AuthServices
{
    public interface IAdminService
    {
        Task<List<AdminDto>> GetAllAdmins();
        Task<GetAddedAdmin> AddAdmin(AddAdminVM model, string currentUserId);
        Task<AdminProfileVM> GetAdminInfo(string UserId);
        Task<AdminProfileVM> UpdateAdminInfo(UpdateAdminProfileVM model, string currentUserId);
        Task<string> DeleteAdmin(string UserId, string currentUserId);
        Task<string> ChangeAdminPassword(ChangePasswordAdminForm model,string currentUserId);

    }
}
