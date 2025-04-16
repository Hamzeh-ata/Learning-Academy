using Arkan.Server.BaseRepository;
using Arkan.Server.Client_Interfaces;
using Arkan.Server.Client_PageModels.Categories;
using Arkan.Server.Data;
using Arkan.Server.Helpers;

namespace Arkan.Server.Client_Repositories
{
    public class ClientCategoriesRepository: IClientCategories
    {
        private readonly ApplicationDBContext _context;

        public ClientCategoriesRepository(ApplicationDBContext context)
        {
            _context = context;
        }


        public async Task<PaginationResult<GetCategories>> GetCategories(int pageNumber, int pageSize, string? name)
        {
            var query = _context.Categories
                .WhereIf(name != null, p => p.Name.ToLower().Contains(name.ToLower()))
            .Select(c => new GetCategories
            {
                Id = c.Id,
                Name = c.Name,
                Description = c.Description,
                Image = c.Image
            })
            .AsQueryable();

            var paginationResult = await PaginationHelper.PaginateAsync(query, pageNumber, pageSize);

            return paginationResult;
        }
    }
}
