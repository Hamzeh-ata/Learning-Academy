using Arkan.Server.BaseRepository;
using Arkan.Server.Data;
using Arkan.Server.Enums;
using Arkan.Server.Helpers;
using Arkan.Server.Interfaces;
using Arkan.Server.LoggerFilter;
using Arkan.Server.Models;
using Arkan.Server.PageModels.ChaptersModels;
using Microsoft.EntityFrameworkCore;

namespace Arkan.Server.Repository
{
    public class ChapterRepository: IChapterInterface
    {
        private readonly ApplicationDBContext _context;
        private readonly IBaseRepository _IBaseRepository;
        private readonly ILoggerService _ILoggerService;
        public ChapterRepository(ApplicationDBContext context,IBaseRepository IBaseRepository, ILoggerService loggerService)
        {
            _context = context;
            _IBaseRepository = IBaseRepository;
            _ILoggerService = loggerService;
        }
        public async Task<GetAddedChapter> AddChapterAsync(AddChapter model, string userId)
        {
            var isCourseExists = await _IBaseRepository.AnyByIdAsync<Course>(model.CourseId);

            if (!isCourseExists)
            {
                return new GetAddedChapter { Key = ResponseKeys.CourseNotFound.ToString() };
            }

            var chapter = new Chapter
            {
                Name = model.Name.Trim(),
                Description = model.Description.Trim(),
                CourseId = model.CourseId,
                IsFree = model.IsFree
            };

            await _IBaseRepository.AddAsync(chapter);

            await _ILoggerService.AddLog(userId, ActionTypes.Add.ToString(), ItemsType.Chapter.ToString(), chapter.Name);

            return new GetAddedChapter
            {
                Id = chapter.Id,
                Name = chapter.Name,
                CourseId = chapter.CourseId,
                IsFree = chapter.IsFree,
                Description = chapter.Description,
                Key = ResponseKeys.Success.ToString()
            };

        }
        public async Task<PaginationResult<GetCourseChapters>> GetCourseChaptersAsync(int pageNumber, int pageSize ,int CourseId)
        {
            var IsCourseExists = await _IBaseRepository.AnyByIdAsync<Course>(CourseId);
            if (!IsCourseExists)
            {
                var response = new List<GetCourseChapters>();
                response.Add(new GetCourseChapters { Key = ResponseKeys.CourseNotFound.ToString() });
                return new PaginationResult<GetCourseChapters>
                {
                    Items = response,
                    TotalCount = 0,
                    PageSize = 0
                };
            }
            var query = _context.Chapters
                .Where(Chpater => Chpater.CourseId == CourseId)
                .Select(Chapter => new GetCourseChapters
                {
                    Id = Chapter.Id,
                    CourseId = Chapter.CourseId,
                    IsFree = Chapter.IsFree,
                    Description = Chapter.Description,
                    Name = Chapter.Name,
                    LessonsCount = Chapter.Lessons.Count(),
                    Lessons = Chapter.Lessons.Select(Lesson => new GetChapterLessons
                    {
                        Name = Lesson.Name,
                        Id = Lesson.Id,
                        IsFree = Lesson.IsFree,
                        Description = Lesson.Description,
                    }).ToList(),
                    Key = ResponseKeys.Success.ToString()
                })
                .AsQueryable();
            var paginationResult = await PaginationHelper.PaginateAsync(query, pageNumber, pageSize);
            return paginationResult;
        }
        public async Task<GetUpdatedChapter> UpdateChapterAsync(UpdateChapter model, string userId)
        {
            var chapter = await _IBaseRepository.FindByIdAsync<Chapter>(model.Id);

            if (chapter is null)
            {
                return new GetUpdatedChapter { Key = ResponseKeys.ChapterNotFound.ToString() };
            }
            var IsCourseExists = await _IBaseRepository.AnyByIdAsync<Course>(model.CourseId);

            if (!IsCourseExists)
            {
                return new GetUpdatedChapter { Key = ResponseKeys.CourseNotFound.ToString() };
            }

            chapter.Name = model.Name.Trim();
            chapter.Description = model.Description.Trim();
            chapter.IsFree=model.IsFree;

            _IBaseRepository.Update(chapter);

            await _ILoggerService.AddLog(userId, ActionTypes.Update.ToString(), ItemsType.Chapter.ToString(), chapter.Name);


            var lessons = await GetChapterLessons(chapter.Id);

            lessons.ForEach(l => l.IsFree = chapter.IsFree);

            return new GetUpdatedChapter {
                Id = chapter.Id,
                Name = chapter.Name,
                CourseId = chapter.CourseId,
                Description = chapter.Description,
                IsFree = chapter.IsFree,
                Lessons = lessons,
                LessonsCount = lessons.Count,
                Key = ResponseKeys.Success.ToString()
            };

        }
        public async Task<string> DeleteChapterAsync(int ChapterId,string userId)
        {
             var chapter = await _IBaseRepository.FindByIdAsync<Chapter>(ChapterId);

             if (chapter is null)
             {
                return ResponseKeys.ChapterNotFound.ToString();
             }

            await _ILoggerService.AddLog(userId, ActionTypes.Update.ToString(), ItemsType.Chapter.ToString(), chapter.Name);

            _IBaseRepository.Remove(chapter);

            return ResponseKeys.Success.ToString();
        }
        private async Task<List<GetChapterLessons>> GetChapterLessons(int ChapterId)
        {
            return await _context.Lessons
                .Where(Lesson => Lesson.ChapterId == ChapterId)
                .Select(Lesson => new GetChapterLessons
                {
                    Id = Lesson.Id,
                    Name = Lesson.Name,
                    IsFree=Lesson.IsFree,
                    Description = Lesson.Description,
                })
                .ToListAsync();
        }
    }
}
