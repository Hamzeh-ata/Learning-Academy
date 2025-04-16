using Arkan.Server.PageModels.ProfileModels;

namespace Arkan.Server.Interfaces
{
    public interface IProfileInterFace
    {
        Task<GetAdminProfileInfo> GetAdminProfileInfo(string UserId);
        Task<GetAdminProfileInfo> UpdateAdminProfileInfo(UpdateAdminProfileInfo model,string UserId);
        Task<GetUserProfileInfo> GetUserProfileInfo(string UserId);
        Task<GetUserProfileInfo> UpdateUserProfileInfo(UpdateUserProfileInfo model, string UserId);
    }
}
