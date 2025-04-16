using Arkan.Server.BaseRepository;
using Arkan.Server.Client_Interfaces;
using Arkan.Server.Data;
using Arkan.Server.Enums;
using Arkan.Server.Interfaces;
using Arkan.Server.Models;
using Arkan.Server.PageModels.UserCartModels;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography.X509Certificates;

namespace Arkan.Server.Client_Repositories
{
    public class UserCartRepository : IUserCart
    {

        private readonly ApplicationDBContext _context;
        private readonly IBaseRepository _IBaseRepository;

        public UserCartRepository(ApplicationDBContext context, IBaseRepository IBaseRepository)
        {
            _context = context;
            _IBaseRepository = IBaseRepository;
        }

        public async Task<GetAddedItem> AddUserCart(AddItemCart model, string userId)
        {
            var isItemExists = await _context.UserCart.AnyAsync(uc => uc.UserId == userId && uc.ItemId == model.ItemId);

            if (isItemExists)
            {
                return new GetAddedItem
                {
                    Key = ResponseKeys.AlreadyExists.ToString()
                };

            }

            var item = new UserCart
            {
                ItemId = model.ItemId,
                Type = model.Type,
                UserId = userId,
                Price = await CalculateItemPrice(model.Type, model.ItemId)
            };

            await _IBaseRepository.AddAsync(item);

            if (item.Type == ItemTypes.Course)
            {
                var course = await _IBaseRepository.FindByIdAsync<Course>(item.ItemId);

                if (course is null)
                {
                    return new GetAddedItem
                    {
                        Key = ResponseKeys.CourseNotFound.ToString()
                    };
                }

                return new GetAddedItem
                {
                    Id = item.ItemId,
                    Name = course.Name,
                    Description = course.Description,
                    Image = course.Image,
                    Price = course.Price,
                    DiscountPrice = course.DiscountPrice,
                    Type = ItemTypes.Course.ToString(),
                    Key = ResponseKeys.Success.ToString()
                };
            }

            var package = await _IBaseRepository.FindByIdAsync<Package>(item.ItemId);

            if (package is null)
            {
                return new GetAddedItem
                {
                    Key = ResponseKeys.PackageNotFound.ToString()
                };
            }

            return new GetAddedItem
            {
                Id = item.ItemId,
                Name = package.Name,
                Description = package.Description,
                Image = package.Image,
                Price = package.Price,
                Type = ItemTypes.Package.ToString(),
                DiscountPrice = package.DiscountPrice,
                Key = ResponseKeys.Success.ToString()
            };
        }
        public async Task<GetUserCart> GetUserCart(string userId)
        {
            var userCart = await _context.UserCart
                .Include(uc => uc.User)
                .Where(uc => uc.UserId == userId)
                .ToListAsync();

            var itemsList = new List<ItemDetails>();

            var itemIds = userCart.Select(uc => uc.ItemId).Distinct();
            var itemTypes = userCart.Select(uc => uc.Type).Distinct();

            var courses = await _context.Courses
                .Where(c => itemIds.Contains(c.Id) && itemTypes.Contains(ItemTypes.Course))
                .ToListAsync();

            var packages = await _context.Package
                .Where(p => itemIds.Contains(p.Id) && itemTypes.Contains(ItemTypes.Package))
                .ToListAsync();

            var coursesDictionary = courses.ToDictionary(c => c.Id);
            var packagesDictionary = packages.ToDictionary(p => p.Id);

            double? totalAmount = userCart.Sum(uc => uc.Price);

            foreach (var item in userCart)
            {
                var itemDetails = new ItemDetails
                {
                    Id = item.ItemId,
                    Type = item.Type.ToString(),
                    ItemCodePrice = item.Code != null ? item.Price : 0,
                    ArkanCode = item.Code,
                };

                if (item.Type == ItemTypes.Course && coursesDictionary.ContainsKey(item.ItemId))
                {
                    var course = coursesDictionary[item.ItemId];
                    itemDetails.Name = course.Name;
                    itemDetails.Description = course.Description;
                    itemDetails.Image = course.Image;
                    itemDetails.Price = course.Price;
                    itemDetails.DiscountPrice = course.DiscountPrice;
                }
                else if (item.Type == ItemTypes.Package && packagesDictionary.ContainsKey(item.ItemId))
                {
                    var package = packagesDictionary[item.ItemId];
                    itemDetails.Name = package.Name;
                    itemDetails.Description = package.Description;
                    itemDetails.Image = package.Image;
                    itemDetails.Price = package.Price;
                    itemDetails.DiscountPrice = package.DiscountPrice;
                }

                itemsList.Add(itemDetails);
            }

            var userCartResponse = new GetUserCart
            {
                Items = itemsList,
                Amount = totalAmount ?? 0,
            };

            return userCartResponse;
        }

        public async Task<string> DeleteItem(string userId, int itemId)
        {
            var itemExists = await _context.UserCart.AnyAsync(uc => uc.UserId == userId && uc.ItemId == itemId);

            if (!itemExists)
            {
                return ResponseKeys.NotFound.ToString();
            }

            var item = await _context.UserCart
                .Where(uc => uc.UserId == userId && uc.ItemId == itemId)
                .FirstAsync();

            var removed = _IBaseRepository.Remove(item);

            if (!removed)
            {
                return ResponseKeys.Failed.ToString();
            }

            return ResponseKeys.Success.ToString();

        }
        public async Task<ArkanCodeResult> AddArkanCode(string userId, int itemId, string code)
        {
            var arkanCode = await _context.ArkanCodes
                .Where(ac => ac.Code == code && ac.IsActive)
                .FirstOrDefaultAsync();

            if (arkanCode is null)
            {
                return new ArkanCodeResult
                {
                    Key = ResponseKeys.ArkanCodeNotFound.ToString()
                };
            }

            var numberOfTimeUsed = await _context.OrderItems
                .CountAsync(oi => oi.Code == code);

            if (numberOfTimeUsed >= arkanCode.NumberTimesUsedAllowed)
            {
                return new ArkanCodeResult
                {
                    Key = "The maximum usage limit has been reached"
                };
            }
           

            var userCartItem = await _context.UserCart
            .Where(uc => uc.UserId == userId && uc.ItemId == itemId)
            .FirstOrDefaultAsync();

            if (userCartItem is null)
            {
                return new ArkanCodeResult
                {
                    Key = ResponseKeys.NotFound.ToString()
                };
            }

            if (userCartItem.Type == ItemTypes.Course)
            {
                if (arkanCode.Type == ArkanCodeTypes.ByCourse)
                {

                    if (arkanCode.ItemId != itemId)
                    {
                        return new ArkanCodeResult
                        {
                            Key = ResponseKeys.NotFound.ToString()
                        };
                    }

                    userCartItem.Price = await CalculateDiscountAmount(arkanCode.Discount, userCartItem.Price);

                    userCartItem.Code = arkanCode.Code;

                    _IBaseRepository.Update<UserCart>(userCartItem);

                    return new ArkanCodeResult
                    {
                        ItemId = itemId,
                        ArkanCode = code,
                        CartAmount = await _context.UserCart.SumAsync(uc => uc.Price),
                        Price = await GetItemPrice(itemId, userCartItem.Type),
                        DiscountPrice = await GetItemDiscountPrice(itemId, userCartItem.Type),
                        ItemCodePrice = userCartItem.Price,
                        Key = ResponseKeys.Success.ToString()
                    };
                }
                if (arkanCode.Type == ArkanCodeTypes.ByInstructor)
                {
                    var instructorCourse = await IsInstructorTeachingCourse(itemId, arkanCode.ItemId);

                    if (!instructorCourse)
                    {
                        return new ArkanCodeResult
                        {
                            Key = ResponseKeys.ArkanCodeNotFound.ToString()
                        };
                    }

                    userCartItem.Price = await CalculateDiscountAmount(arkanCode.Discount, userCartItem.Price);

                    userCartItem.Code = arkanCode.Code;

                    _IBaseRepository.Update<UserCart>(userCartItem);

                    return new ArkanCodeResult
                    {
                        ItemId = itemId,
                        ArkanCode = code,
                        CartAmount = await _context.UserCart.SumAsync(uc => uc.Price),
                        Price = await GetItemPrice(itemId, userCartItem.Type),
                        DiscountPrice = await GetItemDiscountPrice(itemId, userCartItem.Type),
                        ItemCodePrice = userCartItem.Price,
                        Key = ResponseKeys.Success.ToString()
                    };
                }
                return new ArkanCodeResult
                {
                    Key = ResponseKeys.ArkanCodeNotFound.ToString()
                };
            }
            if (userCartItem.Type == ItemTypes.Package)
            {
                if (arkanCode.Type != ArkanCodeTypes.ByPackage)
                {
                    return new ArkanCodeResult
                    {
                        Key = ResponseKeys.ArkanCodeNotFound.ToString()
                    };
                }

                if (arkanCode.ItemId != itemId)
                {
                    return new ArkanCodeResult
                    {
                        Key = ResponseKeys.NotFound.ToString()
                    };
                }

                userCartItem.Price = await CalculateDiscountAmount(arkanCode.Discount, userCartItem.Price);

                userCartItem.Code = arkanCode.Code;

                _IBaseRepository.Update<UserCart>(userCartItem);
                return new ArkanCodeResult
                {
                    ItemId = itemId,
                    ArkanCode = code,
                    CartAmount = await _context.UserCart.SumAsync(uc => uc.Price),
                    Price = await GetItemPrice(itemId, userCartItem.Type),
                    DiscountPrice = await GetItemDiscountPrice(itemId, userCartItem.Type),
                    ItemCodePrice = userCartItem.Price,
                    Key = ResponseKeys.Success.ToString()
                };
            }

            return new ArkanCodeResult
            {
                Key = ResponseKeys.NotFound.ToString()
            };
        }
        public async Task<RemoveArkanCodeResult> RemoveArkanCode(string userId, int itemId)
        {
            var userCartItem = await _context.UserCart
            .Where(uc => uc.UserId == userId && uc.ItemId == itemId)
            .FirstOrDefaultAsync();

            if (userCartItem is null) {

                return new RemoveArkanCodeResult
                {
                    Key = ResponseKeys.NotFound.ToString()
                };
            }

            var arkanCode = await _context.ArkanCodes
                .Where(ac=> ac.Code == userCartItem.Code)
                .FirstOrDefaultAsync();

            if (arkanCode is null)
            {
                return new RemoveArkanCodeResult
                {
                    Key = ResponseKeys.ArkanCodeNotFound.ToString()
                };
            }

            userCartItem.Code = null;
            userCartItem.Price = await CalculateItemPrice(userCartItem.Type, userCartItem.ItemId);

            _IBaseRepository.Update<UserCart>(userCartItem);

            return new RemoveArkanCodeResult
            {
                ItemId = itemId,
                CartAmount = await _context.UserCart.SumAsync(uc => uc.Price),
                Price = await GetItemPrice(itemId, userCartItem.Type),
                DiscountPrice = await GetItemDiscountPrice(itemId, userCartItem.Type),
                Key = ResponseKeys.Success.ToString()
            };
        }
        private async Task<double> CalculateDiscountAmount(double arkanCodeDiscount, double itemPrice)
        {
            double discountPercentage = arkanCodeDiscount / 100;
            double discountAmount = itemPrice * discountPercentage;
            return itemPrice - discountAmount;
        }
        private async Task<double> GetItemPrice(int itemId, ItemTypes itemType)
        {
            switch (itemType)
            {
                case ItemTypes.Course:
                    var course = await _context.Courses.FirstOrDefaultAsync(c => c.Id == itemId);
                    return (double)(course != null ? course.Price : 0);
                case ItemTypes.Package:
                    var package = await _context.Package.FirstOrDefaultAsync(p => p.Id == itemId);
                    return package != null ? (package.Price) : 0;
                default:
                    return 0;
            }
        }
        private async Task<double> GetItemDiscountPrice(int itemId, ItemTypes itemType)
        {
            switch (itemType)
            {
                case ItemTypes.Course:
                    var course = await _context.Courses.FirstOrDefaultAsync(c => c.Id == itemId);
                    return (double)(course != null ? (course.DiscountPrice > 0 ? course.DiscountPrice : 0 ): 0);
                case ItemTypes.Package:
                    var package = await _context.Package.FirstOrDefaultAsync(p => p.Id == itemId);
                    return package != null ? (package.DiscountPrice > 0 ? package.DiscountPrice : 0) : 0;
                default:
                    return 0;
            }
        }
        private async Task<bool> IsInstructorTeachingCourse(int courseId,int instructorId)
        {
            return await _context.Courses
                .AnyAsync(c => c.Id == courseId && c.InstructorId == instructorId);
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
