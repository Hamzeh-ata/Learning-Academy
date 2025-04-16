using Arkan.Server.BaseRepository;
using Arkan.Server.Data;
using Arkan.Server.Enums;
using Arkan.Server.Interfaces;
using Arkan.Server.Models;
using Arkan.Server.PageModels.ArkanCodesModels;
using Microsoft.EntityFrameworkCore;

namespace Arkan.Server.Repository
{
    public class ArkanCodeRepository : IArkanCode
    {
        private readonly ApplicationDBContext _context;
        private readonly IBaseRepository _IBaseRepository;
        public ArkanCodeRepository(ApplicationDBContext context, IBaseRepository IBaseRepository)
        {
            _context = context;
            _IBaseRepository = IBaseRepository;
        }
        public async Task<string> GenerateNumber()
        {
            Random random = new Random();

            const string chars = "0123456789"; 

            while (true)
            {
                string code = new string(Enumerable.Repeat(chars, 12)
                    .Select(s => s[random.Next(s.Length)]).ToArray());

                bool codeExists = await _context.ArkanCodes.AnyAsync(ac => ac.Code == code);

                if (!codeExists)
                {
                    return code;
                }
            }
        }

        public async Task<GetArkanCode> AddArkanCode(AddArkanCode model)
        {
            var isCodeExists = await _context.ArkanCodes.AnyAsync(ac => ac.Code == model.Code);

            if (isCodeExists) {

                return new GetArkanCode
                {
                    Key = ResponseKeys.AlreadyExists.ToString()
                };
            
            }

            var arkanCode = new ArkanCodes
            {
                Code = model.Code,
                IsActive = model.IsActive,
                Discount = model.Discount,
                NumberTimesUsedAllowed = model.NumberTimesUsedAllowed,
                Type = model.Type,
                ItemId = model.ItemId
            };

            await _IBaseRepository.AddAsync<ArkanCodes>(arkanCode);

            return new GetArkanCode
            {
                Id = arkanCode.Id,
                Code = arkanCode.Code,
                Discount = arkanCode.Discount,
                Type = arkanCode.Type,
                ItemId = arkanCode.ItemId,
                IsActive = arkanCode.IsActive,
                NumberTimesUsedAllowed = arkanCode.NumberTimesUsedAllowed,
                Key = ResponseKeys.Success.ToString()
            };

        }

        public async Task<GetArkanCode> UpdateArkanCode(UpdateArkanCode model)
        {
            var arkanCode = await _IBaseRepository.FindByIdAsync<ArkanCodes>(model.Id);

            if (arkanCode == null)
            {
                return new GetArkanCode
                {
                    Key = ResponseKeys.NotFound.ToString(),
                };
            }

            if (arkanCode.Code != model.Code)
            {
                var isCodeExists = await _context.ArkanCodes.AnyAsync(ac => ac.Code == model.Code);

                if (isCodeExists)
                {
                    return new GetArkanCode
                    {
                        Key = ResponseKeys.AlreadyExists.ToString()
                    };
                }
            }
            arkanCode.Code = model.Code;
            arkanCode.IsActive = model.IsActive;
            arkanCode.Discount = model.Discount;
            arkanCode.NumberTimesUsedAllowed = model.NumberTimesUsedAllowed;
            arkanCode.Type = model.Type;
            arkanCode.ItemId = model.ItemId;

            await ChangeItemsCode(arkanCode.Code);

            _IBaseRepository.Update<ArkanCodes>(arkanCode);

            return new GetArkanCode
            {
                Id = arkanCode.Id,
                Code = arkanCode.Code,
                Discount = arkanCode.Discount,
                Type = arkanCode.Type,
                ItemId = arkanCode.ItemId,
                IsActive = arkanCode.IsActive,
                NumberTimesUsedAllowed = arkanCode.NumberTimesUsedAllowed,
                Key = ResponseKeys.Success.ToString()
            };

        }

        public async Task<GetArkanCode> GetArkanCode(int Id)
        {
            var arkanCode = await _IBaseRepository.FindByIdAsync<ArkanCodes>(Id);

            if (arkanCode == null)
            {
                return new GetArkanCode
                {
                    Key = ResponseKeys.NotFound.ToString(),
                };
            }

            return new GetArkanCode
            {
                Id = arkanCode.Id,
                Code = arkanCode.Code,
                Discount = arkanCode.Discount,
                Type = arkanCode.Type,
                ItemId = arkanCode.ItemId,
                IsActive = arkanCode.IsActive,
                NumberTimesUsedAllowed = arkanCode.NumberTimesUsedAllowed,
                Key = ResponseKeys.Success.ToString()
            };
        }

        public async Task<string> RemoveArkanCode(int Id)
        {
            var arkanCode = await _IBaseRepository.FindByIdAsync<ArkanCodes>(Id);

            if (arkanCode == null)
            {
                return ResponseKeys.NotFound.ToString();
            }

            await ChangeItemsCode(arkanCode.Code);


            _IBaseRepository.Remove<ArkanCodes>(arkanCode);

            return ResponseKeys.Success.ToString();
        }

        public async Task<List<GetArkanCodes>> GetArkanCodes()
        {
            return await _context.ArkanCodes
                .Select(ac => new GetArkanCodes
                {
                    Id = ac.Id,
                    Code = ac.Code,
                    Discount = ac.Discount,
                    IsActive = ac.IsActive,
                    NumberTimesUsedAllowed = ac.NumberTimesUsedAllowed,
                    Type = ac.Type,
                    ItemId = ac.ItemId,
                }).ToListAsync();
        }

        private async Task ChangeItemsCode(string code)
        {
            var cartItemsWithCode = await _context.UserCart
                .Where(uc => uc.Code == code)
                .ToListAsync();

            foreach (var item in cartItemsWithCode)
            {
                item.Code = null;
                item.Price = await CalculateItemPrice(item.Type, item.Id);
            }
        }

        private async Task<double> CalculateItemPrice(ItemTypes itemType, int itemId)
        {
            switch (itemType)
            {
                case ItemTypes.Course:
                    var course = await _context.Courses.FirstOrDefaultAsync(c => c.Id == itemId);
                    return (double)(course != null ? (course.DiscountPrice > 0 ? course.DiscountPrice : course.Price) : 0);
                case ItemTypes.Package:
                    var package = await _context.Package.FirstOrDefaultAsync(p => p.Id == itemId);
                    return package != null ? (package.DiscountPrice > 0 ? package.DiscountPrice : package.Price) : 0;
                default:
                    return 0;
            }
        }
    }
}
