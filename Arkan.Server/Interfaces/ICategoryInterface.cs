using Arkan.Server.PageModels.CategoriesModels;

namespace Arkan.Server.Interfaces
{
    public interface ICategoryInterface
    {
        Task<GetAddedCategory> AddCategory(AddCategory model);
        Task<List<GetCategories>> GetAllCategories();
        Task<GetCategory> UpdateCategory(UpdateCategory model);
        Task<GetRelatedCourses> GetRelatedCourses(int categoryId);
        Task<string> RemoveCategory(int CategoryId);
    }
}
