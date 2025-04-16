using Arkan.Server.BaseRepository;
using Arkan.Server.Data;
using Arkan.Server.Enums;
using Arkan.Server.Helpers;
using Arkan.Server.ImagesHelper;
using Arkan.Server.Interfaces;
using Arkan.Server.LoggerFilter;
using Arkan.Server.Models;
using Arkan.Server.Notifications;
using Arkan.Server.PageModels.LessonsModels;
using Microsoft.EntityFrameworkCore;

namespace Arkan.Server.Repository
{
    public class LessonRepository : ILessonInterface
    {

        private readonly ApplicationDBContext _context;
        private readonly IBaseRepository _IBaseRepository;
        private readonly ImageHelperInterface _ImageHelper;
        private readonly INotificationService _NotificationService;
        private readonly ILoggerService _ILoggerService;

        public LessonRepository(ApplicationDBContext context, IBaseRepository IBaseRepository,
            ImageHelperInterface ImageHelper, INotificationService NotificationService, ILoggerService loggerService)
        {
            _context = context;
            _IBaseRepository = IBaseRepository;
            _ImageHelper = ImageHelper;
            _NotificationService = NotificationService;
            _ILoggerService = loggerService;

        }
        public async Task<List<GetLessonsDto>> GetChapterLessons(int ChapterId)
        {
            var isChapterExists = await _IBaseRepository.AnyByIdAsync<Chapter>(ChapterId);

            if (!isChapterExists)
            {
                return new List<GetLessonsDto>();
            }

            var lessons = _context.Lessons
                .Where(lesson => lesson.ChapterId == ChapterId)
                .Select(lesson => new GetLessonsDto
                {
                    Id = lesson.Id,
                    Name = lesson.Name,
                    Description = lesson.Description,
                    VideoUrl = lesson.VideoUrl,
                    IsFree = lesson.IsFree,
                    Material = lesson.Material
                })
                .ToList();

            return lessons;
        }

        public async Task<LessonInfo> AddLesson(AddLesson model, string userId)
        {
            var isChapterExists = await _IBaseRepository.AnyByIdAsync<Chapter>(model.ChapterId);

            if (!isChapterExists)
            {
                return new LessonInfo
                {
                    Key = ResponseKeys.ChapterNotFound.ToString()
                };
            }

            var lesson = new Lesson
            {
                Name = model.Name.Trim(),
                Description = model.Description.Trim(),
                IsFree = model.IsFree,
                VideoUrl = model.VideoUrl.Trim(),
                ChapterId = model.ChapterId,
            };

            if (model.Material != null)
            {
                if (model.Material.Length > (100 * 1024 * 1024)) // 10 MB limit
                {
                    return new LessonInfo
                    {
                        Key = ResponseKeys.FileTooLarage.ToString()
                    };
                }

                var allowedContentTypes = new[] { "application/pdf", "application/msword", "application/vnd.ms-powerpoint", "text/plain" };

                if (!allowedContentTypes.Contains(model.Material.ContentType))
                {
                    return new LessonInfo
                    {
                        Key = ResponseKeys.UnsupportedType.ToString()
                    };
                }

                lesson.Material = await _ImageHelper.AddMaterial(model.Material);
            }

            await _IBaseRepository.AddAsync(lesson);

            await _ILoggerService.AddLog(userId, ActionTypes.Add.ToString(), ItemsType.Lesson.ToString(), lesson.Name);


            List<string> enrolledStudents = await _IBaseRepository.GetCourseEnrolledUserIds(lesson.Id);

            foreach(var studentId in enrolledStudents)
            {
                await _NotificationService.Notify(NotifyTopics.client.ToString(), $"New Lesson Added {lesson.Name}", studentId);
            }

            return new LessonInfo
            {
                Id = lesson.Id,
                Name = lesson.Name,
                Description = lesson.Description,
                IsFree = lesson.IsFree,
                VideoUrl = lesson.VideoUrl,
                ChapterId = lesson.ChapterId,
                Material = lesson.Material,
                Key = ResponseKeys.Success.ToString()
            };
        }
        public async Task<LessonInfo> UpdateLesson(UpdateLesson model, string userId)
        {
            var isLessonExists = await _IBaseRepository.AnyByIdAsync<Lesson>(model.Id);

            if (!isLessonExists)
            {
                return new LessonInfo
                {
                    Key = ResponseKeys.LessonNotFound.ToString()
                };
            }

            var lesson = await _IBaseRepository.FindByIdAsync<Lesson>(model.Id);

            lesson.Name = model.Name.Trim();
            lesson.Description = model.Description.Trim();
            lesson.IsFree = model.IsFree;
            lesson.VideoUrl = model.VideoUrl.Trim();


            if (model.Material != null && !(model.Material is string))
            {
                if (!string.IsNullOrEmpty(lesson.Material))
                {
                    await _ImageHelper.DeleteMaterial(lesson.Material);
                }

                if (model.Material.Length > (100 * 1024 * 1024)) // 100 MB limit
                {
                    return new LessonInfo
                    {
                        Key = ResponseKeys.FileTooLarage.ToString()
                    };
                }

                var allowedContentTypes = new[] { "application/pdf", "application/msword", "application/vnd.ms-powerpoint", "text/plain" };

                if (!allowedContentTypes.Contains(model.Material.ContentType))
                {
                    return new LessonInfo
                    {
                        Key = ResponseKeys.UnsupportedType.ToString()
                    };
                }

                lesson.Material = await _ImageHelper.AddMaterial(model.Material);
            }


            _IBaseRepository.Update(lesson);

            await _ILoggerService.AddLog(userId, ActionTypes.Update.ToString(), ItemsType.Lesson.ToString(), lesson.Name);

            return new LessonInfo
            {
                Id = lesson.Id,
                Name = lesson.Name,
                Description = lesson.Description,
                IsFree = lesson.IsFree,
                VideoUrl = lesson.VideoUrl,
                ChapterId = lesson.ChapterId,
                Material = lesson.Material,
                Key = ResponseKeys.Success.ToString()
            };
        }
        public async Task<string> DeleteLesson(int LessonId, string userId)
        {
            var isLessonExists = await _IBaseRepository.AnyByIdAsync<Lesson>(LessonId);

            if (!isLessonExists) {
                return ResponseKeys.LessonNotFound.ToString();
            }

            var lesson = await _IBaseRepository.FindByIdAsync<Lesson>(LessonId);

            if (!string.IsNullOrEmpty(lesson.Material))
            {
                await _ImageHelper.DeleteMaterial(lesson.Material);
            }

            var quiz = await _context.Quiz.Where(q => q.LessonId == LessonId)
              .FirstOrDefaultAsync();

            if (quiz is not null)
            {
                var quizQuestions = await _context.Question
                .Where(question => question.QuizId == quiz.Id && question.ImageUrl != null)
                .Select(question => new { question.ImageUrl, question.Id })
                .ToListAsync();

                foreach (var question in quizQuestions)
                {
                    if (!string.IsNullOrEmpty(question.ImageUrl))
                    {
                        await _ImageHelper.DeleteImage(question.ImageUrl);
                    }
                }

                var answersImages = await _context.Answer
                    .Where(answer => quizQuestions.Select(q => q.Id).Contains(answer.QuestionId) && answer.ImageUrl != null)
                    .Select(answer => answer.ImageUrl)
                    .ToListAsync();

                foreach (var answerImage in answersImages)
                {

                    if (!string.IsNullOrEmpty(answerImage))
                    {
                        await _ImageHelper.DeleteImage(answerImage);
                    }
                }

                var quizAttempts = await _context.UserQuizAttempt.Where(uqa => uqa.QuizId == quiz.Id).ToListAsync();

                _IBaseRepository.RemoveRange<UserQuizAttempt>(quizAttempts);
            }

            _IBaseRepository.Remove<Lesson>(lesson);

            await _ILoggerService.AddLog(userId, ActionTypes.Delete.ToString(), ItemsType.Lesson.ToString(), lesson.Name);

            return ResponseKeys.Success.ToString();
        }

    }
}
