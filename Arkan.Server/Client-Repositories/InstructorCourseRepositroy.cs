using Arkan.Server.BaseRepository;
using Arkan.Server.Client_Interfaces;
using Arkan.Server.Client_PageModels.Chapters;
using Arkan.Server.Client_PageModels.Lessons;
using Arkan.Server.Data;
using Arkan.Server.Enums;
using Arkan.Server.Helpers;
using Arkan.Server.ImagesHelper;
using Arkan.Server.Models;
using Arkan.Server.Notifications;
using Arkan.Server.RoleServices;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualBasic;

namespace Arkan.Server.Client_Repositories
{
    public class InstructorCourseRepositroy : IInstructorCourse
    {
        private readonly ApplicationDBContext _context;
        private readonly IBaseRepository _IBaseRepository;
        private readonly IRoles _IRoles;
        private readonly ImageHelperInterface _ImageHelper;
        private readonly INotificationService _NotificationService;
        public InstructorCourseRepositroy(ApplicationDBContext context, IBaseRepository IBaseRepository, IRoles Roles, ImageHelperInterface ImageHelper, INotificationService NotificationService)
        {
            _context = context;
            _IBaseRepository = IBaseRepository;
            _IRoles= Roles;
            _ImageHelper = ImageHelper;
            _NotificationService = NotificationService;
        }
        public async Task<ClientGetAddedChapter> AddChapterAsync(ClientAddChapter model,string userId)
        {
            var userRole = await  _IRoles.FindUserRole(userId);

            if(userRole != Roles.Instructor.ToString())
            {
                return new ClientGetAddedChapter { Key = ResponseKeys.InstructorNotFound.ToString() };
            }

            var isCourseExists = await _IBaseRepository.AnyByIdAsync<Course>(model.CourseId);

            if (!isCourseExists)
            {
                return new ClientGetAddedChapter { Key = ResponseKeys.CourseNotFound.ToString() };
            }

            var isCourseInstructor = await IsCourseInstructorByCourseId(model.CourseId, userId);

            if(!isCourseInstructor) {
                return new ClientGetAddedChapter { Key = ResponseKeys.UnauthorizedAccess.ToString() };
            }

            var Chapter = new Chapter
            {
                Name = model.Name.Trim(),
                Description = model.Description.Trim(),
                CourseId = model.CourseId,
                IsFree = model.IsFree
            };

            await _IBaseRepository.AddAsync(Chapter);

            return new ClientGetAddedChapter
            {
                Id = Chapter.Id,
                Name = model.Name,
                IsFree = model.IsFree,
                Description = model.Description,
                Key = ResponseKeys.Success.ToString()
            };

        }
        public async Task<ClientGetUpdatedChapter> UpdateChapterAsync(ClientUpdateChapter model, string userId)
        {

            var userRole = await _IRoles.FindUserRole(userId);

            if (userRole != Roles.Instructor.ToString())
            {
                return new ClientGetUpdatedChapter { Key = ResponseKeys.InstructorNotFound.ToString() };
            }

            var chapter = await _IBaseRepository.FindByIdAsync<Chapter>(model.Id);

            if (chapter is null)
            {
                return new ClientGetUpdatedChapter { Key = ResponseKeys.ChapterNotFound.ToString() };
            }

            var isCourseInstructor = await IsCourseInstructorByCourseId(chapter.CourseId, userId);

            if (!isCourseInstructor)
            {
                return new ClientGetUpdatedChapter { Key = ResponseKeys.UnauthorizedAccess.ToString() };
            }

            chapter.Name = model.Name.Trim();
            chapter.Description = model.Description.Trim();
            chapter.IsFree = model.IsFree;

            _IBaseRepository.Update(chapter);

            var lessons = await GetChapterLessons(chapter.Id);

            lessons.ForEach(l => l.IsFree = chapter.IsFree);

            return new ClientGetUpdatedChapter
            {
                Id = chapter.Id,
                Name = chapter.Name,
                Description = chapter.Description,
                IsFree = model.IsFree,
                Lessons = lessons,
                LessonsCount = lessons.Count,
                Key = ResponseKeys.Success.ToString()
            };

        }
        public async Task<string> DeleteChapterAsync(int ChapterId, string userId)
        {
            var userRole = await _IRoles.FindUserRole(userId);

            if (userRole != Roles.Instructor.ToString())
            {
                return ResponseKeys.InstructorNotFound.ToString();
            }

            var Chapter = await _IBaseRepository.FindByIdAsync<Chapter>(ChapterId);

            if (Chapter is null)
            {
                return ResponseKeys.ChapterNotFound.ToString();
            }
            var isCourseInstructor = await IsCourseInstructorByCourseId(Chapter.CourseId, userId);

            if (!isCourseInstructor)
            {
                return  ResponseKeys.UnauthorizedAccess.ToString();
            }

            _IBaseRepository.Remove(Chapter);

            return ResponseKeys.Success.ToString();
        }
        public async Task<GetAddedLesson> AddLesson(AddLesson model, string userId)
        {
            var isChapterExists = await _IBaseRepository.AnyByIdAsync<Chapter>(model.ChapterId);

            if (!isChapterExists)
            {
                return new GetAddedLesson
                {
                    Key = ResponseKeys.ChapterNotFound.ToString()
                };
            }


            var isCourseInstructor = await IsCourseInstructor(model.ChapterId, userId);

            if (!isCourseInstructor) {
                return new GetAddedLesson
                {
                    Key = ResponseKeys.UnauthorizedAccess.ToString()
                };
            }


            var lesson = new Lesson
            {
                Name = model.Name.Trim(),
                Description = model.Description.Trim(),
                IsFree = model.IsFree,
                VideoUrl = model.VideoUrl,
                ChapterId = model.ChapterId,
            };

            if (model.Material != null)
            {
                if (model.Material.Length > (100 * 1024 * 1024)) // 100 MB limit
                {
                    return new GetAddedLesson
                    {
                        Key = ResponseKeys.FileTooLarage.ToString()
                    };
                }

                var allowedContentTypes = new[] { "application/pdf", "application/msword", "application/vnd.ms-powerpoint", "text/plain" };

                if (!allowedContentTypes.Contains(model.Material.ContentType))
                {
                    return new GetAddedLesson
                    {
                        Key = ResponseKeys.UnsupportedType.ToString()
                    };
                }

                lesson.Material = await _ImageHelper.AddMaterial(model.Material);
            }

            await _IBaseRepository.AddAsync(lesson);


    

            List<string> enrolledStudents = await _IBaseRepository.GetCourseEnrolledUserIds(lesson.Id);

            foreach (var enrolledUserId in enrolledStudents)
            {
                await _NotificationService.Notify("client", $"New Lesson Added {lesson.Name}", enrolledUserId);
            }

            return new GetAddedLesson
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
        public async Task<GetUpdatedLesson> UpdateLesson(UpdateLesson model,string userId)
        {
            var isLessonExists = await _IBaseRepository.AnyByIdAsync<Lesson>(model.Id);

            if (!isLessonExists)
            {
                return new GetUpdatedLesson
                {
                    Key = ResponseKeys.LessonNotFound.ToString()
                };
            }
            

            var lesson = await _IBaseRepository.FindByIdAsync<Lesson>(model.Id);


            var isCourseInstructor = await IsCourseInstructor(lesson.ChapterId, userId);

            if (!isCourseInstructor)
            {
                return new GetUpdatedLesson
                {
                    Key = ResponseKeys.UnauthorizedAccess.ToString()
                };
            }

            lesson.Name = model.Name.Trim();
            lesson.Description = model.Description.Trim();
            lesson.IsFree = model.IsFree;
            lesson.VideoUrl = model.VideoUrl;
         
            if (model.Material != null && !(model.Material is string))
            {
                if (!string.IsNullOrEmpty(lesson.Material))
                {
                    await _ImageHelper.DeleteMaterial(lesson.Material);
                }

                if (model.Material.Length > (100 * 1024 * 1024)) // 100 MB limit
                {
                    return new GetUpdatedLesson
                    {
                        Key = ResponseKeys.FileTooLarage.ToString()
                    };
                }

                var allowedContentTypes = new[] { "application/pdf", "application/msword", "application/vnd.ms-powerpoint", "text/plain" };

                if (!allowedContentTypes.Contains(model.Material.ContentType))
                {
                    return new GetUpdatedLesson
                    {
                        Key = ResponseKeys.UnsupportedType.ToString()
                    };
                }

                lesson.Material = await _ImageHelper.AddMaterial(model.Material);
            }

            _IBaseRepository.Update(lesson);

            return new GetUpdatedLesson
            {
                Id = lesson.Id,
                Name = lesson.Name,
                Description = lesson.Description,
                IsFree = lesson.IsFree,
                VideoUrl = lesson.VideoUrl,
                Material = lesson.Material,
                Quiz = lesson.Quiz != null ? new LessonQuiz
                {
                    Id = lesson.Quiz.Id,
                    Name = lesson.Quiz.Title,
                    Description = lesson.Quiz.Description,
                    TimeLimit = lesson.Quiz.TimeLimit,
                    TotalMarks = lesson.Quiz.TotalMarks,
                    IsRequierd = lesson.Quiz.IsRequierd,
                    StartDate = lesson.Quiz.StartDate,
                    EndDate = lesson.Quiz.EndDate
                } : null,
                Key = ResponseKeys.Success.ToString()
            };
        }
        public async Task<string> DeleteLesson(int LessonId, string userId)
        {
            var isLessonExists = await _IBaseRepository.AnyByIdAsync<Lesson>(LessonId);

            if (!isLessonExists)
            {
                return ResponseKeys.LessonNotFound.ToString();
            }
            var lesson = await _IBaseRepository.FindByIdAsync<Lesson>(LessonId);

            var isCourseInstructor = await IsCourseInstructor(lesson.ChapterId, userId);

            if (!isCourseInstructor)
            {
                return ResponseKeys.UnauthorizedAccess.ToString();
            }

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

            return ResponseKeys.Success.ToString();
        }
        private async Task<bool> IsCourseInstructorByCourseId(int CourseId, string userId)
        {
            var courseInstructorId = await _context.Courses
             .Where(c => c.Id == CourseId)
             .Select(c => c.InstructorId)
             .FirstOrDefaultAsync();

            var instructorId = await _IBaseRepository.GetInstructorIdByUserID(userId);

            if (courseInstructorId != instructorId)
            {
                return false;
            }
            return true;

        }
        private async Task<bool> IsCourseInstructor(int ChapterId,string userId)
        {
            var chapterCourseId = await _context.Chapters
              .Where(c => c.Id == ChapterId)
              .Select(c => c.CourseId)
              .FirstOrDefaultAsync();


            var courseInstructorId = await _context.Courses
             .Where(c => c.Id == chapterCourseId)
             .Select(c => c.InstructorId)
             .FirstOrDefaultAsync();

            var instructorId = await _IBaseRepository.GetInstructorIdByUserID(userId);

            if (courseInstructorId != instructorId)
            {
                return false;
            }
            return true;
        }
        public async Task<List<GetLessonsWithQuiz>> GetChapterLessons(int ChapterId)
        {
            return await _context.Lessons
                .Where(Lesson => Lesson.ChapterId == ChapterId)
                .Select(Lesson => new GetLessonsWithQuiz
                {
                    Id = Lesson.Id,
                    Name = Lesson.Name,
                    IsFree = Lesson.IsFree,
                    Description = Lesson.Description,
                    VideoUrl = Lesson.VideoUrl,
                    Material = Lesson.Material,
                    Quiz = Lesson.Quiz != null ? new LessonQuiz
                    {
                        Id = Lesson.Quiz.Id,
                        Name = Lesson.Quiz.Title,
                        Description = Lesson.Quiz.Description,
                        TimeLimit = Lesson.Quiz.TimeLimit,
                        TotalMarks = Lesson.Quiz.TotalMarks,
                        IsRequierd = Lesson.Quiz.IsRequierd,
                        StartDate = Lesson.Quiz.StartDate,
                        EndDate = Lesson.Quiz.EndDate
                    } : null
                })
                .ToListAsync();
        }
    }
}
