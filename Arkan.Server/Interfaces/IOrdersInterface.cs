using Arkan.Server.Helpers;
using Arkan.Server.PageModels.OrdersModels;
using Arkan.Server.PageModels.Payments;

namespace Arkan.Server.Interfaces
{
    public interface IOrdersInterface
    {
        Task<PaginationResult<GetPendingOrders>> GetOrders(int pageNumber, int pageSize);
        Task<string> ConfirmOrders(List<int> Ids, string userId);
        Task<string> DeleteOrders(List<int> Ids);
        byte[] GenerateConfirmedOrdersExcelFile(List<GetConfirmedOrders> orders);
        Task<PaginationResult<GetConfirmedOrders>> GetConfirmedOrders(int pageNumber, int pageSize);
        GetExcelFile GenerateOrderPaymentsExcelFile(int orderId);
        byte[] GeneratePendingOrdersExcelFile(List<GetPendingOrders> orders);
        Task<List<GetConfirmedOrders>> GetConfirmedOrders();
        Task<List<GetPendingOrders>> GetOrders();
    }
}
