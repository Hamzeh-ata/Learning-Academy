using Arkan.Server.PageModels.ChangePasswordRequests;

namespace Arkan.Server.Interfaces
{
    public interface IForgotPassword
    {
        Task<ForgotPasswordModel> ForgotPasswordRequest(string email, string newPassword);
        Task<List<ChangePasswordRequests>> GetChangePasswordRequests();
        Task<string> ConfirmRequest(int id);
        Task<string> DeleteRequest(int Id);
    }
}
