using Microsoft.AspNetCore.DataProtection.KeyManagement;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace Arkan.Server.Helpers
{
    public static class PaginationHelper
    {
        public static async Task<PaginationResult<T>> PaginateAsync<T>(IQueryable<T> query, int pageNumber, int pageSize)
        {
            if (pageNumber < 1)
                throw new ArgumentException("Page number must be greater than or equal to 1.");

          


            var itemsc = await query.ToListAsync();

            // Now get the total count from the materialized list
            var totalItemsCount = itemsc.Count;

            var totalPages = (int)Math.Ceiling((double)totalItemsCount / pageSize);
            var hasNextPage = pageNumber < totalPages;
            var hasPreviousPage = pageNumber > 1;

            var items = await query.Skip((pageNumber - 1) * pageSize)
                                  .Take(pageSize)
                                  .ToListAsync();

            return new PaginationResult<T>
            {
                Items = items,
                TotalCount = totalItemsCount,
                PageSize = pageSize,
                CurrentPage = pageNumber,
                HasNextPage = hasNextPage,
                HasPreviousPage = hasPreviousPage
            };
        }
        public static async Task<PaginationResult<T>> PaginateAsync<T>(IQueryable<T> query, int pageNumber, int pageSize, Expression<Func<T, IKey>> orderBy = null)
        {
            if (pageNumber < 1)
                throw new ArgumentException("Page number must be greater than or equal to 1.");

            if (pageSize < 1)
                throw new ArgumentException("Page size must be greater than or equal to 1.");

            if (orderBy != null)
            {
                query.OrderBy(orderBy);
            }

            var totalItemsCount = await query.CountAsync();

            var totalPages = (int)Math.Ceiling((double)totalItemsCount / pageSize);
            var hasNextPage = pageNumber < totalPages;
            var hasPreviousPage = pageNumber > 1;

            var items = await query.Skip((pageNumber - 1) * pageSize)
                                  .Take(pageSize)
                                  .ToListAsync();

            return new PaginationResult<T>
            {
                Items = items,
                TotalCount = totalItemsCount,
                PageSize = pageSize,
                CurrentPage = pageNumber,
                HasNextPage = hasNextPage,
                HasPreviousPage = hasPreviousPage
            };
        }
        public static async Task<PaginationResult<T>> PaginateAsync<T, TKey>(IQueryable<T> query, int pageNumber, int pageSize = 10,
        Expression<Func<T, bool>> filter = null)
         {
            if (pageNumber < 1)
                throw new ArgumentException("Page number must be greater than or equal to 1.");

            if (pageSize < 1)
                throw new ArgumentException("Page size must be greater than or equal to 1.");
            if (filter != null)
            {
                query = query.Where(filter);
            }

            var totalItemsCount = await query.CountAsync();

            var totalPages = (int)Math.Ceiling((double)totalItemsCount / pageSize);
            var hasNextPage = pageNumber < totalPages;
            var hasPreviousPage = pageNumber > 1;

            var items = await query.Skip((pageNumber - 1) * pageSize)
                                  .Take(pageSize)
                                  .ToListAsync();

            return new PaginationResult<T>
            {
                Items = items,
                TotalCount = totalItemsCount,
                PageSize = pageSize,
                CurrentPage = pageNumber,
                HasNextPage = hasNextPage,
                HasPreviousPage = hasPreviousPage
            };
        }

    }
}
