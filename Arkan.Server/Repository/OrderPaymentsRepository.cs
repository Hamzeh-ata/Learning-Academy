using Arkan.Server.BaseRepository;
using Arkan.Server.Data;
using Arkan.Server.Enums;
using Arkan.Server.Interfaces;
using Arkan.Server.Models;
using Arkan.Server.PageModels.Payments;
using Microsoft.EntityFrameworkCore;
namespace Arkan.Server.Repository
{
    public class OrderPaymentsRepository : IOrderPaymentsInterface
    {
        private readonly ApplicationDBContext _context;
        private readonly IBaseRepository _IBaseRepository;
        public OrderPaymentsRepository(ApplicationDBContext context, IBaseRepository IBaseRepository)
        {
            _context = context;
            _IBaseRepository = IBaseRepository;
        }
        public async Task<GetPayment> AddPayment(AddPayment model)
        {
            var userOrder = await _context.UserOrder
                .Where(uo => uo.Id == model.OrderId)
                .FirstOrDefaultAsync();

            if (userOrder is null)
            {
                return new GetPayment
                {
                    Key = ResponseKeys.NotFound.ToString()
                };
            }

            var totalPayments = await _context.OrderPayments
                    .Where(op => op.OrderId == model.OrderId)
                    .SumAsync(op => op.AmountPaid);

            var orderAmount = userOrder.DiscountAmount > 0 ? userOrder.DiscountAmount : userOrder.Amount;

            if (totalPayments >= orderAmount)
            {
                return new GetPayment
                {
                    Key = ResponseKeys.AmountPrepaid.ToString()
                };
            }
            if (model.AmountPaid > orderAmount)
            {
                return new GetPayment
                {
                    Key = ResponseKeys.Overpaid.ToString()
                };
            }
            DateTime utcNow = DateTime.UtcNow;
            // Convert UTC time to Jordan time
            TimeZoneInfo jordanTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Jordan Standard Time");
            DateTime jordanTime = TimeZoneInfo.ConvertTimeFromUtc(utcNow, jordanTimeZone);

            var payment = new OrderPayments
            {
                OrderId = model.OrderId,
                PaymentDate = jordanTime,
                AmountPaid = model.AmountPaid,
            };

            await _IBaseRepository.AddAsync(payment);

            return new GetPayment
            {
                Id = payment.Id,
                AmountPaid = payment.AmountPaid,
                PaymentDate = payment.PaymentDate,
                Key = ResponseKeys.Success.ToString()
            };
        }
        public async Task<string> RemovePayment(int paymentId)
        {
            var paymentExists = await _IBaseRepository.AnyByIdAsync<OrderPayments>(paymentId);

            if (!paymentExists)
            {
                return ResponseKeys.NotFound.ToString();
            }

            var payment = await _IBaseRepository.FindByIdAsync<OrderPayments>(paymentId);

            _IBaseRepository.Remove<OrderPayments>(payment);

            return ResponseKeys.Success.ToString();
        }
        public async Task<OrderPaymentsInfo> GetOrderPayments(int orderId)
        {
            var orderExists = await _IBaseRepository.AnyByIdAsync<UserOrder>(orderId);

            if (!orderExists)
            {
                return new OrderPaymentsInfo();
            }
            
            var payments = await _context.OrderPayments
                .Where(op=> op.OrderId == orderId)
                .Select(op => new GetOrderPayments
                {
                    Id = op.Id,
                    AmountPaid =op.AmountPaid,
                    PaymentDate = op.PaymentDate,
                   
                }).ToListAsync();


            var getOrderAmount = await _context.UserOrder
                .Where(oi => oi.Id == orderId)
                .FirstOrDefaultAsync();


            var orderAmount = getOrderAmount.DiscountAmount > 0 ? getOrderAmount.DiscountAmount : getOrderAmount.Amount;

            double paymentsAmount = payments.Sum(p => p.AmountPaid);

            var remainingAmount = orderAmount - paymentsAmount;

            return new OrderPaymentsInfo
            {
                OrderAmount = orderAmount,
                TotalPayments = paymentsAmount,
                RemainingAmount = remainingAmount,
                Payments = payments
            };

        }
    }
}
