using Arkan.Server.BaseRepository;
using Arkan.Server.Data;
using Arkan.Server.Enums;
using Arkan.Server.ImagesHelper;
using Arkan.Server.Interfaces;
using Arkan.Server.Models;
using Arkan.Server.PageModels.QuizModels;
using Microsoft.EntityFrameworkCore;


namespace Arkan.Server.Repository
{
    public class QuizRepository : IQuizInterface
    {

        private readonly ApplicationDBContext _context;
        private readonly IBaseRepository _IBaseRepository;
        private readonly ImageHelperInterface _ImageHelper;
        public QuizRepository(ApplicationDBContext context, IBaseRepository IBaseRepository, ImageHelperInterface imageHelper)
        {
            _context = context;
            _IBaseRepository = IBaseRepository;
            _ImageHelper = imageHelper;
        }
        public async Task<GetAddedQuiz> AddQuiz(AddQuizDto model)
        {
            var isLessonExists = await _IBaseRepository.AnyByIdAsync<Lesson>(model.LessonId);

            if (!isLessonExists)
            {
                return new GetAddedQuiz
                {
                    Key = ResponseKeys.LessonNotFound.ToString()
                };
            }

            var lessonHasQuiz = await _context.Quiz.AnyAsync(quiz => quiz.LessonId == model.LessonId);

            if (lessonHasQuiz)
            {
                return new GetAddedQuiz
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
                return new GetAddedQuiz
                {
                    Key = ResponseKeys.Failed.ToString()
                };
            }

            return new GetAddedQuiz
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
        public async Task<GetQuiz> GetQuiz(int LessonId)
        {
            var quiz = await _context.Quiz
                .Where(quiz => quiz.LessonId == LessonId)
                .Include(quiz => quiz.Questions)
                  .ThenInclude(Question => Question.Answers)
                .FirstOrDefaultAsync();

            if (quiz is null)
            {
                return new GetQuiz { Key = ResponseKeys.QuizNotFound.ToString() };
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
                TotalMarks = quiz.Questions.Sum(q => q.Points),
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
                }).ToList(),
                Key = ResponseKeys.Success.ToString()
            };

            return getQuiz;

        }
        public async Task<int> GetQuizId(int LessonId)
        {
            var isLessonExists = await _IBaseRepository.AnyByIdAsync<Lesson>(LessonId);

            if (isLessonExists == false)
            {
                return 0;
            }

            return await _context.Quiz.Where(q => q.LessonId == LessonId)
                .Select(q => q.Id)
                .FirstOrDefaultAsync();
        }
        public async Task<GetAddedQuiz> UpdateQuiz(UpdateQuizDto model)
        {
            var isQuizExists = await _IBaseRepository.AnyByIdAsync<Quiz>(model.QuizId);

            if (!isQuizExists)
            {
                return new GetAddedQuiz { Key = ResponseKeys.QuizNotFound.ToString() };
            };

            var quiz = await _IBaseRepository.FindByIdAsync<Quiz>(model.QuizId);

            quiz.Title = model.Title.Trim();
            quiz.Description = model.Description.Trim();
            quiz.TimeLimit = model.TimeLimit;
            quiz.IsRandomized = model.IsRandomized;
            quiz.IsRequierd = model.IsRequired;
            quiz.TotalMarks = model.TotalMarks;


            var isQuizUpdated = _IBaseRepository.Update(quiz);

            if (!isQuizUpdated)
            {
                return new GetAddedQuiz { Key = ResponseKeys.Failed.ToString() };
            }

            return new GetAddedQuiz
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
        public async Task<string> RemoveQuiz(int QuizId)
        {
            var isQuizExists = await _IBaseRepository.AnyByIdAsync<Quiz>(QuizId);

            if (!isQuizExists)
            {
                return ResponseKeys.QuizNotFound.ToString();
            };

            var quiz = await _IBaseRepository.FindByIdAsync<Quiz>(QuizId);

            var quizQuestions = await _context.Question
            .Where(question => question.QuizId == QuizId && question.ImageUrl != null)
            .Select(question => new { question.ImageUrl, question.Id })
            .ToListAsync();


            foreach (var question in quizQuestions)
            {
                if (question.ImageUrl != null)
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
                if (answerImage != null)
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
        public async Task<bool> IsRandomized(int QuizId)
        {
            var quiz = await _IBaseRepository.FindByIdAsync<Quiz>(QuizId);

            return quiz.IsRandomized;
        }
    }
}
