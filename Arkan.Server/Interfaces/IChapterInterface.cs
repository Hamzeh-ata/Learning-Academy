using Arkan.Server.Helpers;
using Arkan.Server.PageModels.ChaptersModels;

namespace Arkan.Server.Interfaces
{
    public interface IChapterInterface
    {
        Task<GetAddedChapter> AddChapterAsync(AddChapter model,string userId);
        Task<PaginationResult<GetCourseChapters>> GetCourseChaptersAsync(int pageNumber, int pageSize, int CourseId);
        Task<GetUpdatedChapter> UpdateChapterAsync(UpdateChapter model, string userId);
        Task<string> DeleteChapterAsync(int ChapterId, string userId);
    }
}
