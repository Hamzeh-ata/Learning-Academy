using Arkan.Server.BaseRepository;
using Arkan.Server.Client_Interfaces;
using Arkan.Server.Client_PageModels.Chapters;
using Arkan.Server.Data;
using Arkan.Server.Enums;
using Arkan.Server.Models;
using Arkan.Server.PageModels.CourseModels;
using Microsoft.EntityFrameworkCore;

namespace Arkan.Server.Client_Repositories
{
    public class ClientChaptersRepository : IClientChapters
    {
        private readonly ApplicationDBContext _context;
        private readonly IBaseRepository _IBaseRepository;
        public ClientChaptersRepository(ApplicationDBContext context, IBaseRepository IBaseRepository)
        {
            _context = context;
            _IBaseRepository = IBaseRepository;
        }
        public async Task<List<ClientGetChapters>> GetChapters(int courseId,string? userId)
        {
            var studentId = 0;

            var userType = "";

            if (userId is not null)
            {
                 userType = await GetUserType(userId);

                if (userType == Roles.Student.ToString())
                {
                     studentId = await _IBaseRepository.GetStudentIdByUserId(userId);
                }
            }

            var hiddenChapters = await _context.NoneStudentChapters
            .Where(nsc => nsc.CourseId == courseId && nsc.UserId == userId)
            .Select(nsc => nsc.ChapterId)
            .ToListAsync();

            var chapters = await _context.Chapters
                .Where(c => c.CourseId == courseId && !hiddenChapters.Contains(c.Id))
                .Include(c => c.Lessons)
                 .ThenInclude(l => l.Quiz)
                .Select(c => new ClientGetChapters
                {
                    Id = c.Id,
                    Name = c.Name,
                    Description = c.Description,
                    IsFree = c.IsFree,
                    Lessons = c.Lessons.Select(l => new GetChapterLessons
                    {
                        Id = l.Id,
                        Name = l.Name,
                        Description = l.Description,
                        IsFree = l.IsFree,
                        VideoUrl = l.VideoUrl,
                        IsCompleted = studentId != 0 &&
                          _context.StudentWatchedLessons.Any(sl => sl.LessonId == l.Id && sl.StudentId == studentId),
                        Material = l.Material,
                        Quiz = l.Quiz != null ? new LessonQuiz
                        {
                            Id = l.Quiz.Id,
                            Name = l.Quiz.Title,
                            Description = l.Quiz.Description,
                            TimeLimit = l.Quiz.TimeLimit,
                            TotalMarks = l.Quiz.TotalMarks,
                            IsRequierd = l.Quiz.IsRequierd,
                            StartDate = l.Quiz.StartDate,
                            EndDate = l.Quiz.EndDate,
                            AllowAttempt = l.Quiz.AllowReAttempt ? true : userId != null && userType == Roles.Student.ToString() &&
                                               !_context.UserQuizAttempt.Any(uqa => uqa.UserId == userId && uqa.QuizId == l.Quiz.Id),
                            IsReviewAble = _context.UserQuizAttempt.Any(uqa => uqa.UserId == userId && uqa.QuizId == l.Quiz.Id)
                        } : null
                    }).ToList()
                }).ToListAsync();

            return chapters;
        }
        public async Task<string> LessonCompleted(int lessonId, string userId)
        {
            var isLessonExists = await _IBaseRepository.AnyByIdAsync<Lesson>(lessonId);

            if (!isLessonExists)
            {
                return ResponseKeys.LessonNotFound.ToString();
            }
      
            var studentId = await _IBaseRepository.GetStudentIdByUserId(userId);

            var lessonHasQuiz = await _context.Lessons
                   .AnyAsync(l => l.Quiz != null && l.Id == lessonId);

            if (lessonHasQuiz)
            {

                var quizId = await _context.Quiz
                    .Where(q => q.LessonId == lessonId && q.IsRequierd)
                    .Select(q => q.Id).FirstOrDefaultAsync();

                if (quizId != 0)
                {
                    var isQuizAttempted = await IsQuizattempted(userId, quizId);

                    if (!isQuizAttempted)
                    {
                        return ResponseKeys.QuizNotAttempt.ToString();
                    }
                }
                
            }

            var addLessonAsWatched = new StudentCompletedLessons
            {
                LessonId = lessonId,
                StudentId = studentId,
            };


           var isAdded =  await _IBaseRepository.AddAsync(addLessonAsWatched);

          if (!isAdded)
          {
              return ResponseKeys.Failed.ToString();
          }

            return ResponseKeys.Success.ToString();

        }
        public async Task<bool> IsQuizattempted(string userId , int quizId)
        {
            return await _context.UserQuizAttempt
                       .AnyAsync(uqa => uqa.UserId == userId && uqa.QuizId == quizId);
        }
        private async Task<string> GetUserType(string UserId)
        {
            var role = await _context.UsersRoles
                   .Where(ur => ur.UserId == UserId)
                   .Select(ur => ur.Role.Name)
                   .FirstOrDefaultAsync();

            return role;
        }
       
}
}
