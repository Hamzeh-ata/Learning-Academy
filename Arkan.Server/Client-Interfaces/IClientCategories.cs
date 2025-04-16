using Arkan.Server.Client_PageModels.Categories;
using Arkan.Server.Helpers;

namespace Arkan.Server.Client_Interfaces
{
    public interface IClientCategories
    {
        Task<PaginationResult<GetCategories>> GetCategories(int pageNumber, int pageSize, string? name);
    }
}
