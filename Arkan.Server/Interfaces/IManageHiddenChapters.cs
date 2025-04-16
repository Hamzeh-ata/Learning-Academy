using Arkan.Server.Helpers;
using Arkan.Server.PageModels.ManageHiddenChapters;

namespace Arkan.Server.Interfaces
{
    public interface IManageHiddenChapters
    {
        Task<string> HideChapterForStudents(HideChapterStudents model);
        Task<string> UnhideChapterForStudents(UnHideChapterStudents model);
        Task<PaginationResult<ChapterStudents>> ChapterStudents(int chapterId, int courseId, int pageNumber, int pageSize);
        Task<PaginationResult<ChapterStudents>> NoneChapterStudents(int chapterId, int courseId, int pageNumber, int pageSize);
    }
}
