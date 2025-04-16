namespace Arkan.Server.Client_Interfaces
{
    public interface IUserOrders
    {
        Task<string> SubmitUserOrder(string? code, string userId);
    }
}
