namespace Arkan.Server.Client_Interfaces
{
    public interface IUserPassword
    {
        Task<string> ChangePassword(string newPassword, string userId);
    }
}
