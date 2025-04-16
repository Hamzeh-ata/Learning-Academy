using Arkan.Server.Helpers;
using Arkan.Server.PageModels.OrdersModels;

namespace Arkan.Server.Interfaces
{
    public interface IOrdersFilter
    {
        Task<PaginationResult<GetConfirmedOrders>> GetFilteredConfirmedOrders(OrdersFilter model);
        Task<PaginationResult<GetPendingOrders>> GetFilteredPendingOrders(OrdersFilter model);
    }
}
