using Arkan.Server.BaseRepository;
using Arkan.Server.Data;
using Arkan.Server.Enums;
using Arkan.Server.Helpers;
using Arkan.Server.ImagesHelper;
using Arkan.Server.Interfaces;
using Arkan.Server.Models;
using Arkan.Server.Notifications;
using Arkan.Server.PageModels.InstructorModels;
using Arkan.Server.PageModels.ManageHiddenChapters;
using Microsoft.EntityFrameworkCore;

namespace Arkan.Server.Repository
{
    public class ManageHiddenChaptersRepository : IManageHiddenChapters
    {
        private readonly ApplicationDBContext _context;
        private readonly IBaseRepository _IBaseRepository;
        public ManageHiddenChaptersRepository(ApplicationDBContext context, IBaseRepository IBaseRepository)
        {
            _context = context;
            _IBaseRepository = IBaseRepository;
        }
        public async Task<string> HideChapterForStudents(HideChapterStudents model)
        {
            var isHiddenBefore = await _context.NoneStudentChapters
                .AnyAsync(nc => nc.ChapterId == model.ChapterId && nc.CourseId == model.CourseId && model.UserIds.Contains(nc.UserId));

            if (isHiddenBefore)
            {
                return ResponseKeys.Failed.ToString();
            }

            var hideChapters = model.UserIds.Select(userId => new NoneStudentChapters
            {
                ChapterId = model.ChapterId,
                CourseId = model.CourseId,
                UserId = userId
            }).ToList();

            _IBaseRepository.AddRange<NoneStudentChapters>(hideChapters);

            return ResponseKeys.Success.ToString();
        }
        public async Task<string> UnhideChapterForStudents(UnHideChapterStudents model)
        {
            var chaptersToUnhide = await _context.NoneStudentChapters
                .Where(nc => nc.ChapterId == model.ChapterId && nc.CourseId == model.CourseId && model.UserIds.Contains(nc.UserId))
                .ToListAsync();

            if (chaptersToUnhide.Count == 0)
            {
                return ResponseKeys.Failed.ToString();
            }

            _IBaseRepository.RemoveRange<NoneStudentChapters>(chaptersToUnhide);

            return ResponseKeys.Success.ToString();
        }
        public async Task<PaginationResult<ChapterStudents>> ChapterStudents(int chapterId,int courseId,int pageNumber, int pageSize)
        {
            var hiddenStudents = await _context.NoneStudentChapters
            .Where(nsc => nsc.CourseId == courseId && nsc.ChapterId == chapterId)
            .Select(nsc => nsc.UserId)
            .ToListAsync();

            var query = _context.Enrollments
                .Where(e => e.CourseId == courseId)
                .Include(e => e.Student)
                .ThenInclude(e=> e.User)
                .Where(e => !hiddenStudents.Contains(e.Student.UserId))
                .Select(e => new ChapterStudents
                {
                    UserId = e.Student.UserId,
                    UserName = e.Student.User.FirstName + " " + e.Student.User.LastName,
                    EnrollDate = e.EnrollmentDate.ToShortDateString(),
                    PhoneNumber = e.Student.User.PhoneNumber
                }).AsQueryable();

            var paginationResult = await PaginationHelper.PaginateAsync(query, pageNumber, pageSize);

            return paginationResult;
        }
        public async Task<PaginationResult<ChapterStudents>> NoneChapterStudents(int chapterId, int courseId, int pageNumber, int pageSize)
        {
            var hiddenStudents = await _context.NoneStudentChapters
            .Where(nsc => nsc.CourseId == courseId && nsc.ChapterId == chapterId)
            .Select(nsc => nsc.UserId)
            .ToListAsync();

            var query = _context.Enrollments
                .Where(e => e.CourseId == courseId)
                .Include(e => e.Student)
                .ThenInclude(e => e.User)
                .Where(e => hiddenStudents.Contains(e.Student.UserId))
                .Select(e => new ChapterStudents
                {
                    UserId = e.Student.UserId,
                    UserName = e.Student.User.FirstName + " " + e.Student.User.LastName,
                    EnrollDate = e.EnrollmentDate.ToShortDateString(),
                    PhoneNumber = e.Student.User.PhoneNumber

                }).AsQueryable();

            var paginationResult = await PaginationHelper.PaginateAsync(query, pageNumber, pageSize);

            return paginationResult;
        }
    }
}
