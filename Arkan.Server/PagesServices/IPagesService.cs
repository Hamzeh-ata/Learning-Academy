using Arkan.Server.PageModels.UserPagesModels;

namespace Arkan.Server.PagesServices
{
    public interface IPagesService
    {
        Task<GetUserPagesDto> GetUserPages(string UserId);
        Task<GetAddedPage> AddPage(AddPageDto model);
    }
}
