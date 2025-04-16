using Arkan.Server.BaseRepository;
using Arkan.Server.Client_Interfaces;
using Arkan.Server.Client_PageModels.InstructorQuiz;
using Arkan.Server.Data;
using Arkan.Server.Enums;
using Arkan.Server.Helpers;
using Arkan.Server.ImagesHelper;
using Arkan.Server.Models;
using Arkan.Server.PageModels.QuizModels;
using Microsoft.EntityFrameworkCore;

namespace Arkan.Server.Client_Repositories
{
    public class InstructorQuizRepository: IInstructorQuiz
    {
        private readonly ApplicationDBContext _context;
        private readonly IBaseRepository _IBaseRepository;
        private readonly ImageHelperInterface _ImageHelper;
        public InstructorQuizRepository(ApplicationDBContext context, IBaseRepository IBaseRepository, ImageHelperInterface imageHelper)
        {
            _context = context;
            _IBaseRepository = IBaseRepository;
            _ImageHelper = imageHelper;
        }
        public async Task<ClientGetAddedQuiz> AddQuiz(ClientAddQuiz model , string userId)
        {
            var isLessonExists = await _IBaseRepository.AnyByIdAsync<Lesson>(model.LessonId);

            if (!isLessonExists)
            {
                return new ClientGetAddedQuiz
                {
                    Key = ResponseKeys.LessonNotFound.ToString()
                };
            }

            var instructorId = await _IBaseRepository.GetInstructorIdByUserID(userId);

            if (instructorId == 0)
            {
                return new ClientGetAddedQuiz
                {
                    Key = ResponseKeys.UnauthorizedAccess.ToString()
                };
            }


            var isTeachingCourse = await IsTeachingCourse(model.LessonId, instructorId);
            
            if(!isTeachingCourse)
            {
                return new ClientGetAddedQuiz
                {
                    Key = ResponseKeys.UnauthorizedAccess.ToString()
                };
            }

            var lessonHasQuiz = await _context.Quiz.AnyAsync(quiz => quiz.LessonId == model.LessonId);

            if (lessonHasQuiz)
            {
                return new ClientGetAddedQuiz
                {
                    Key = ResponseKeys.LessonHasQuiz.ToString()
                };
            }

            var quiz = new Quiz
            {
                LessonId = model.LessonId,
                Title = model.Title.Trim(),
                Description = model.Description.Trim(),
                TimeLimit = model.TimeLimit,
                IsRequierd = model.IsRequired,
                IsRandomized = model.IsRandomized,
                TotalMarks = model.TotalMarks,
            };

            var isQuizAdded = await _IBaseRepository.AddAsync<Quiz>(quiz);

            if (!isQuizAdded)
            {
                return new ClientGetAddedQuiz
                {
                    Key = ResponseKeys.Failed.ToString()
                };
            }

            return new ClientGetAddedQuiz
            {
                Id = quiz.Id,
                LessonId = quiz.LessonId,
                Title = quiz.Title,
                Description = quiz.Description,
                TimeLimit = quiz.TimeLimit,
                IsRequired = quiz.IsRequierd,
                IsRandomized = quiz.IsRandomized,
                TotalMarks = quiz.TotalMarks,
                Key = ResponseKeys.Success.ToString(),
            };

        }
        public async Task<ClientGetAddedQuiz> UpdateQuiz(ClientUpdateQuiz model, string userId)
        {
            var isQuizExists = await _IBaseRepository.AnyByIdAsync<Quiz>(model.QuizId);

            if (!isQuizExists)
            {
                return new ClientGetAddedQuiz { Key = ResponseKeys.QuizNotFound.ToString() };
            };
            
            var quiz = await _IBaseRepository.FindByIdAsync<Quiz>(model.QuizId);

            var instructorId = await _IBaseRepository.GetInstructorIdByUserID(userId);

            if (instructorId == 0)
            {
                return new ClientGetAddedQuiz
                {
                    Key = ResponseKeys.UnauthorizedAccess.ToString()
                };
            }

            var isTeachingCourse = await IsTeachingCourse(quiz.LessonId, instructorId);

            if (!isTeachingCourse)
            {
                return new ClientGetAddedQuiz
                {
                    Key = ResponseKeys.UnauthorizedAccess.ToString()
                };
            }

            quiz.Title = model.Title.Trim();
            quiz.Description = model.Description.Trim();
            quiz.TimeLimit = model.TimeLimit;
            quiz.IsRandomized = model.IsRandomized;
            quiz.IsRequierd = model.IsRequired;
            quiz.TotalMarks = model.TotalMarks;

            var isQuizUpdated = _IBaseRepository.Update(quiz);

            if (!isQuizUpdated)
            {
                return new ClientGetAddedQuiz { Key = ResponseKeys.Failed.ToString() };
            }

            return new ClientGetAddedQuiz
            {
                Id = quiz.Id,
                LessonId = quiz.LessonId,
                Title = quiz.Title,
                Description = quiz.Description,
                TimeLimit = quiz.TimeLimit,
                IsRequired = quiz.IsRequierd,
                IsRandomized = quiz.IsRandomized,
                TotalMarks = quiz.TotalMarks,
                Key = ResponseKeys.Success.ToString(),
            };
        }
        public async Task<string> RemoveQuiz(int QuizId,string userId)
        {
            var isQuizExists = await _IBaseRepository.AnyByIdAsync<Quiz>(QuizId);

            if (!isQuizExists)
            {
                return ResponseKeys.QuizNotFound.ToString();
            };

            var quiz = await _IBaseRepository.FindByIdAsync<Quiz>(QuizId);

            var instuctorId = await _IBaseRepository.GetInstructorIdByUserID(userId);

            if (instuctorId == 0)
            {
                return ResponseKeys.UnauthorizedAccess.ToString();
            }

            var isTeachingCourse = await IsTeachingCourse(quiz.LessonId, instuctorId);

            if (!isTeachingCourse)
            {
                return ResponseKeys.UnauthorizedAccess.ToString();
            }

            var quizQuestions = await _context.Question
            .Where(question => question.QuizId == QuizId && question.ImageUrl != null)
            .Select(question => new { question.ImageUrl, question.Id })
            .ToListAsync();

            foreach (var question in quizQuestions)
            {
                if(!string.IsNullOrEmpty(question.ImageUrl))
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

            var isQuizRemoved = _IBaseRepository.Remove<Quiz>(quiz);

            if (!isQuizRemoved)
            {
                return ResponseKeys.Failed.ToString();
            }

            return ResponseKeys.Success.ToString();
        }
        public async Task<GetQuiz> GetQuiz(int LessonId, string userId)
        {
            var isLessonExists = await _IBaseRepository.AnyByIdAsync<Lesson>(LessonId);

            if (!isLessonExists)
            {
                return new GetQuiz { Key = ResponseKeys.LessonNotFound.ToString() };
            };

            var quiz = await _context.Quiz
                .Where(quiz => quiz.LessonId == LessonId)
                .Include(quiz => quiz.Questions)
                  .ThenInclude(Question => Question.Answers)
                .FirstOrDefaultAsync();

            if (quiz is null)
            {
                return new GetQuiz { Key = ResponseKeys.QuizNotFound.ToString() };
            }

            var instructorId = await _IBaseRepository.GetInstructorIdByUserID(userId);

            if (instructorId == 0)
            {
                return new GetQuiz
                {
                    Key = ResponseKeys.UnauthorizedAccess.ToString()
                };
            }

            var isTeachingCourse = await IsTeachingCourse(quiz.LessonId, instructorId);

            if (!isTeachingCourse)
            {
                return new GetQuiz { 
                    Key = ResponseKeys.UnauthorizedAccess.ToString()
                };
            }

            var getQuiz = new GetQuiz
            {
                Id = quiz.Id,
                LessonId = quiz.LessonId,
                Title = quiz.Title,
                Description = quiz.Description,
                TimeLimit = quiz.TimeLimit,
                IsRequired = quiz.IsRequierd,
                IsRandomized = quiz.IsRandomized,
                TotalMarks = quiz.TotalMarks,
                Key = ResponseKeys.Success.ToString(),
                Questions = quiz.Questions.Select(q => new GetQuizQuestion
                {
                    Id = q.Id,
                    Title = q.Title,
                    Description = q.Description,
                    Image = q.ImageUrl,
                    Points = q.Points,
                    Order = q.Order,
                    Answers = q.Answers.Select(a => new GetQuizAnswer
                    {
                        Id = a.Id,
                        Title = a.Title,
                        Description = a.Description,
                        Image = a.ImageUrl,
                        IsCorrect = a.IsCorrect,
                        Order = a.Order
                    }).ToList()
                }).ToList()
            };

            return getQuiz;
        }
        private async Task<bool> IsTeachingCourse(int lessonId , int InstructorId)
        {
            var courseId = await _context.Lessons
                .Where(l => l.Id == lessonId)
                .Select(l => l.Chapter.CourseId)
                .FirstOrDefaultAsync();

            var courseInstructorId = await _context.Courses
                .Where(c => c.Id == courseId)
                .Select(c => c.InstructorId)
                .FirstOrDefaultAsync();

            return courseInstructorId == InstructorId;
        }
    }
}
