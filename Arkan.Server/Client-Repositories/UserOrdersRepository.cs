using Arkan.Server.BaseRepository;
using Arkan.Server.Client_Interfaces;
using Arkan.Server.Data;
using Arkan.Server.Enums;
using Arkan.Server.Models;
using Arkan.Server.Notifications;
using Microsoft.EntityFrameworkCore;

namespace Arkan.Server.Client_Repositories
{
    public class UserOrdersRepository : IUserOrders
    {
        private readonly ApplicationDBContext _context;
        private readonly IBaseRepository _IBaseRepository;
        private readonly INotificationService _NotificationService;
        public UserOrdersRepository(ApplicationDBContext context, IBaseRepository IBaseRepository, INotificationService NotificationService)
        {
            _context = context;
            _IBaseRepository = IBaseRepository;
            _NotificationService = NotificationService;
        }
        public async Task<string> SubmitUserOrder(string? code,string userId)
        {
            if (userId is null)
            {
                return ResponseKeys.UserNotFound.ToString();
            }

            var userHaveOrders = await _context.UserCart.AnyAsync(uc => uc.UserId == userId);

            if (!userHaveOrders) {

                return ResponseKeys.NoOrdersFound.ToString();
            }

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var userCart = await _context.UserCart
                .Where(uc => uc.UserId == userId)
                .ToListAsync();

                var cartAmount = userCart.Sum(uc => uc.Price);

                var userOrder = new UserOrder
                {
                    OrderDate = _IBaseRepository.GetJordanTime(),
                    UserId = userId,
                    Amount = cartAmount,
                };

                if (code != null)
                {
                
                  var promoCode = await _context.PromoCodes
                 .Where(pc => pc.Code.Equals(code.Trim()) && pc.IsActive)
                 .FirstOrDefaultAsync();

                    if (promoCode is null)
                    {
                        return ResponseKeys.PromoCodeNotFound.ToString();
                    }

                    if (promoCode.Type == PromoTypes.AmountThreshold)
                    {
                        if (cartAmount < promoCode.ThresholdValue)
                        {
                            return $"The order amount must be greater than {promoCode.ThresholdValue}.";
                        }
                        userOrder.PromoCode = promoCode.Code;
                        userOrder.DiscountAmount = await CalculateDiscountAmount(promoCode.Discount, cartAmount);
                        promoCode.NumberOfTimeUsed += 1;
                    }

                    else if(promoCode.Type == PromoTypes.CountThreshold)
                    {
                        var userCartItemsCount = userCart.Count;

                        if (userCartItemsCount <= promoCode.ThresholdValue)
                        {
                            return $"The order must contain more than {promoCode.ThresholdValue} items.";
                        }
                        userOrder.PromoCode = promoCode.Code;
                        userOrder.DiscountAmount = await CalculateDiscountAmount(promoCode.Discount, cartAmount);
                        promoCode.NumberOfTimeUsed += 1;
                    }
                }

                await _IBaseRepository.AddAsync(userOrder);

                var orderItems = new List<OrderItems>();

                foreach (var item in userCart)
                {
                    var orderItem = new OrderItems
                    {
                        UserOrderId = userOrder.Id,
                        ItemId = item.ItemId,
                        Type = item.Type,
                        Price = item.Price,
                        Code = item.Code
                    };
                    orderItems.Add(orderItem);

                    if (item.Code != null)
                    {
                        var arkanCode = await _context.ArkanCodes
                        .Where(ac => ac.Code == item.Code)
                        .FirstOrDefaultAsync();

                        if (arkanCode is null)
                        {
                            return ResponseKeys.ArkanCodeNotFound.ToString();
                        }
                        arkanCode.NumberTimesUsedAllowed += 1;
                    }
                }

                await _IBaseRepository.AddRangeAsync<OrderItems>(orderItems);

                _IBaseRepository.RemoveRange<UserCart>(userCart);

                string notificationMessage = "New order received";

                await _NotificationService.NotifyAdmin("admin", notificationMessage, AdminNotifications.Orders);

                await transaction.CommitAsync();

                return ResponseKeys.Success.ToString();
            }

            catch (Exception ex)
            {
                await transaction.RollbackAsync();

                return ResponseKeys.Failed.ToString();
            }
        }
        private async Task<double> CalculateDiscountAmount(double promoCodeDiscount, double orderAmount)
        {
            double discountPercentage = promoCodeDiscount / 100;
            double discountAmount = orderAmount * discountPercentage;
            return orderAmount - discountAmount;
        }
    }
}
