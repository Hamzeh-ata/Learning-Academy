using Arkan.Server.PageModels.Payments;

namespace Arkan.Server.Interfaces
{
    public interface IOrderPaymentsInterface
    {
        Task<GetPayment> AddPayment(AddPayment model);
        Task<string> RemovePayment(int paymentId);
        Task<OrderPaymentsInfo> GetOrderPayments(int orderId);
    }
}
