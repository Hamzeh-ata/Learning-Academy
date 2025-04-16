using Arkan.Server.BaseRepository;
using Arkan.Server.Data;
using Arkan.Server.Enums;
using Arkan.Server.Helpers;
using Arkan.Server.Interfaces;
using Arkan.Server.PageModels.CourseModels;
using Arkan.Server.PageModels.OrdersModels;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using static NuGet.Packaging.PackagingConstants;

namespace Arkan.Server.Repository
{
    public class OrdersFilterRepository: IOrdersFilter
    {

        private readonly ApplicationDBContext _context;
        public OrdersFilterRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task<PaginationResult<GetPendingOrders>> GetFilteredPendingOrders(OrdersFilter model)
        {
            var totalPayments = await _context.OrderPayments
             .GroupBy(op => op.OrderId)
             .Select(g => new { OrderId = g.Key, TotalPayments = g.Sum(op => op.AmountPaid) })
             .ToDictionaryAsync(g => g.OrderId, g => g.TotalPayments);

            var courseNames = await _context.Courses.ToDictionaryAsync(c => c.Id, c => c.Name);
            var packageNames = await _context.Package.ToDictionaryAsync(p => p.Id, p => p.Name);

            var query = _context.UserOrder
               .Where(uo => !uo.IsConfirmed)
               .Include(uo => uo.OrderItems)
               .Select(uo => new GetPendingOrders
               {
                   Id = uo.Id,
                   UserName = uo.User.FirstName + " " + uo.User.LastName,
                   UserPhone = uo.User.PhoneNumber,
                   OrderDate = uo.OrderDate,
                   Items = uo.OrderItems.Select(oi => new OrdersItems
                   {
                       Id = oi.Id,
                       Name = oi.Type == ItemTypes.Course ? courseNames.ContainsKey(oi.ItemId) ? courseNames[oi.ItemId] : "Unknown Course" :
                        oi.Type == ItemTypes.Package ? packageNames.ContainsKey(oi.ItemId) ? packageNames[oi.ItemId] : "Unknown Package" :
                        "Unknown Item Type",
                       Price = oi.Price,
                       Type = oi.Type.ToString(),
                       Code = oi.Code
                   }).ToList(),
                   Amount = uo.DiscountAmount > 0 ? uo.DiscountAmount : uo.Amount,
                   DiscountAmount = uo.DiscountAmount > 0 ? (uo.DiscountAmount / uo.Amount) * 100 : 0,
                   PromoCode = uo.PromoCode
               })
               .OrderByDescending(uo => uo.OrderDate)
               .AsQueryable();


            query = query.WhereIf(!string.IsNullOrEmpty(model.UserName), o => o.UserName.ToLower().Contains(model.UserName.ToLower()));

            switch (model.SortOrder?.ToLower())
            {
                case "asc":
                    query = query.OrderBy(GetPendingOrderByExpression(model.SortBy));
                    break;
                case "desc":
                    query = query.OrderByDescending(GetPendingOrderByExpression(model.SortBy));
                    break;
                default:
                    break;
            }

            var paginationResult = await PaginationHelper.PaginateAsync(query, model.PageNumber, model.PageSize);

            return paginationResult;
        }

        public async Task<PaginationResult<GetConfirmedOrders>> GetFilteredConfirmedOrders(OrdersFilter model)
        {

            var totalPayments = await _context.OrderPayments
             .GroupBy(op => op.OrderId)
             .Select(g => new { OrderId = g.Key, TotalPayments = g.Sum(op => op.AmountPaid) })
             .ToDictionaryAsync(g => g.OrderId, g => g.TotalPayments);


            var courseNames = await _context.Courses.ToDictionaryAsync(c => c.Id, c => c.Name);
            var packageNames = await _context.Package.ToDictionaryAsync(p => p.Id, p => p.Name);

            var query = _context.UserOrder
               .Where(uo => uo.IsConfirmed)
               .Include(uo => uo.OrderItems)
               .Select(uo => new GetConfirmedOrders
               {
                   Id = uo.Id,
                   UserName = uo.User.FirstName + " " + uo.User.LastName,
                   UserPhone = uo.User.PhoneNumber,
                   OrderDate = uo.OrderDate,
                   Items = uo.OrderItems.Select(oi => new OrdersItems
                   {
                       Id = oi.Id,
                       Name = oi.Type == ItemTypes.Course ? courseNames.ContainsKey(oi.ItemId) ? courseNames[oi.ItemId] : "Unknown Course" :
                        oi.Type == ItemTypes.Package ? packageNames.ContainsKey(oi.ItemId) ? packageNames[oi.ItemId] : "Unknown Package" :
                        "Unknown Item Type",
                       Price = oi.Price,
                       Type = oi.Type.ToString(),
                       Code = oi.Code,
                   }).ToList(),
                   Amount = uo.DiscountAmount > 0 ? uo.DiscountAmount:uo.Amount,
                   DiscountAmount = uo.DiscountAmount > 0 ? (uo.DiscountAmount / uo.Amount) * 100 : 0,
                   PromoCode = uo.PromoCode,
                   TotalPayments = totalPayments.ContainsKey(uo.Id) ? totalPayments[uo.Id] : 0,
                   RemainingAmount = uo.DiscountAmount > 0 ?
                    (uo.DiscountAmount - (totalPayments.ContainsKey(uo.Id) ? totalPayments[uo.Id] : 0)) :
                    (uo.Amount - (totalPayments.ContainsKey(uo.Id) ? totalPayments[uo.Id] : 0))
               })
               .OrderByDescending(uo => uo.OrderDate)
               .AsQueryable();


            query = query.WhereIf(!string.IsNullOrEmpty(model.UserName), o => o.UserName.ToLower().Contains(model.UserName.ToLower()));

            switch (model.SortOrder?.ToLower())
            {
                case "asc":
                    query = query.OrderBy(GetOrderByExpression(model.SortBy));
                    break;
                case "desc":
                    query = query.OrderByDescending(GetOrderByExpression(model.SortBy));
                    break;
                default:
                    break;
            }

            var paginationResult = await PaginationHelper.PaginateAsync(query, model.PageNumber, model.PageSize);

            return paginationResult;
        }

        private Expression<Func<GetPendingOrders, object>> GetPendingOrderByExpression(string sortBy)
        {

            switch (sortBy.ToLower())
            {
                case "id":
                    return o => o.Id;

                case "date":
                    return o => o.OrderDate;

                case "items":
                    return o => o.Items.Count();

                case "amount":
                    return o => o.Items.Sum(i => i.Price);

                default:
                    return null;
            }
        }

        private Expression<Func<GetConfirmedOrders, object>> GetOrderByExpression(string sortBy)
        {

            switch (sortBy.ToLower())
            {
                case "id":
                    return o => o.Id;

                case "date":
                    return o => o.OrderDate;

                case "items":
                    return o => o.Items.Count();

                case "amount":
                    return o => o.Items.Sum(i=>i.Price);

                default:
                    return null; 
            }
        }

    }
}
