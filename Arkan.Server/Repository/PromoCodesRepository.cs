using Arkan.Server.BaseRepository;
using Arkan.Server.Data;
using Arkan.Server.Enums;
using Arkan.Server.Interfaces;
using Arkan.Server.Models;
using Arkan.Server.PageModels.PromoCodes;
using Microsoft.EntityFrameworkCore;

namespace Arkan.Server.Repository
{
    public class PromoCodesRepository : IPromoCodes
    {
        private readonly ApplicationDBContext _context;
        private readonly IBaseRepository _IBaseRepository;
        public PromoCodesRepository(ApplicationDBContext context, IBaseRepository IBaseRepository)
        {
            _context = context;
            _IBaseRepository = IBaseRepository;
        }
        public async Task<GetPromoCode> AddPromoCode(AddPromoCode model)
        {
            var isCodeExists = await _context.PromoCodes
                .AnyAsync(pc => pc.Code == model.Code);

            if(isCodeExists)
            {
                return new GetPromoCode
                {
                    Key = ResponseKeys.NameExists.ToString()
                };
            }

            var promoCode = new PromoCodes
            {
                Code = model.Code.Trim(),
                Discount = model.Discount,
                IsActive = model.IsActive,
                ThresholdValue = model.ThresholdValue,
                Type = model.Type,
            };

            await _IBaseRepository.AddAsync(promoCode);

            return new GetPromoCode
            {
                Id = promoCode.Id,
                Code = promoCode.Code,
                ThresholdValue = promoCode.ThresholdValue,
                Type = promoCode.Type,
                Discount = promoCode.Discount,
                IsActive = promoCode.IsActive,
                NumberOfTimeUsed = 0,
                Key = ResponseKeys.Success.ToString()
            };

        }
        public async Task<GetPromoCode> GetPromoCode(int id)
        {
            var promoCode = await _IBaseRepository.FindByIdAsync<PromoCodes>(id);

            if (promoCode is null)
            {
                return new GetPromoCode
                {
                    Key = ResponseKeys.NotFound.ToString()
                };
            }

            return new GetPromoCode
            {
                Id = promoCode.Id,
                Code = promoCode.Code,
                ThresholdValue = promoCode.ThresholdValue,
                Type = promoCode.Type,
                Discount = promoCode.Discount,
                IsActive = promoCode.IsActive,
                NumberOfTimeUsed = 0,
                Key = ResponseKeys.Success.ToString()
            };

        }
        public async Task<GetPromoCode> UpdatePromoCode(UpdatePromoCode model)
        {
            var promoCode = await _IBaseRepository.FindByIdAsync<PromoCodes>(model.Id);

            if(promoCode is null)
            {
                return new GetPromoCode
                {
                    Key = ResponseKeys.NotFound.ToString()
                };
            }

            var isCodeExists = await _context.PromoCodes
                .AnyAsync(pc => pc.Code == model.Code && pc.Id != model.Id);

            if (isCodeExists)
            {
                return new GetPromoCode
                {
                    Key = ResponseKeys.NameExists.ToString()
                };
            }

            promoCode.Code = model.Code.Trim();
            promoCode.Discount = model.Discount;
            promoCode.IsActive = model.IsActive;
            promoCode.ThresholdValue = model.ThresholdValue;
            promoCode.Type = model.Type;

            _IBaseRepository.Update<PromoCodes>(promoCode);

            return new GetPromoCode
            {
                Id = promoCode.Id,
                Code = promoCode.Code,
                ThresholdValue = promoCode.ThresholdValue,
                Type = promoCode.Type,
                Discount = promoCode.Discount,
                IsActive = promoCode.IsActive,
                NumberOfTimeUsed = promoCode.NumberOfTimeUsed,
                Key = ResponseKeys.Success.ToString()
            };

        }
        public async Task<string> RemovePromoCode(int id)
        {
            var promoCode = await _IBaseRepository.FindByIdAsync<PromoCodes>(id);

            if (promoCode is null)
            {

                return ResponseKeys.NotFound.ToString();
                
            }

            _IBaseRepository.Remove(promoCode);

            return ResponseKeys.Success.ToString();
        }
        public async Task<List<GetPromoCodes>> GetPromoCodes()
        {
            return await _context.PromoCodes
                .Select(pc => new GetPromoCodes
                {
                    Id = pc.Id,
                    Code = pc.Code,
                    Discount = pc.Discount,
                    IsActive = pc.IsActive,
                    Type = pc.Type,
                    ThresholdValue = pc.ThresholdValue,
                    NumberOfTimeUsed = pc.NumberOfTimeUsed
                }).ToListAsync();
        }
        public async Task<PromoCodeResult> CheckPromoCode(string code,double orderAmount,string userId)
        {

            var userCart = await _context.UserCart
            .Where(uc => uc.UserId == userId)
            .ToListAsync();

            if (userCart.Count == 0)
            {
                return new PromoCodeResult
                {
                    Key = ResponseKeys.NoOrdersFound.ToString()
                };
            }

            var promoCode = await _context.PromoCodes
                .Where(pc => pc.Code.Equals(code) && pc.IsActive)
                .FirstOrDefaultAsync();

            if (promoCode is null)
            {
                return new PromoCodeResult
                {
                    Key = ResponseKeys.NotFound.ToString()
                };
            }


            if (promoCode.Type == PromoTypes.AmountThreshold)
            {

                if (orderAmount < promoCode.ThresholdValue)
                {
                    return new PromoCodeResult
                    {
                        Key = $"The order amount must be greater than {promoCode.ThresholdValue}."
                    };
                }


                return new PromoCodeResult
                {
                    DiscountAmount = await CalculateDiscountAmount(promoCode.Discount, orderAmount),
                    Key = ResponseKeys.Success.ToString()
                };

            }

            var userCartItems = userCart.Count;

            if (userCartItems <= promoCode.ThresholdValue)
                {
                    return new PromoCodeResult
                    {
                        Key = $"The order must contain more than {promoCode.ThresholdValue} items."
                    };
                }

            return new PromoCodeResult
            {
                DiscountAmount = await CalculateDiscountAmount(promoCode.Discount, orderAmount),
                Key = ResponseKeys.Success.ToString()
            };
        }
        private async Task<double> CalculateDiscountAmount(double promoCodeDiscount , double orderAmount)
        {
            double discountPercentage = promoCodeDiscount / 100;
            double discountAmount = orderAmount * discountPercentage;
            return orderAmount - discountAmount;
        }
    }
}
