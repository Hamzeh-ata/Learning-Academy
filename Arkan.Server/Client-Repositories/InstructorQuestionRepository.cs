using Arkan.Server.BaseRepository;
using Arkan.Server.Client_Interfaces;
using Arkan.Server.Data;
using Arkan.Server.Enums;
using Arkan.Server.ImagesHelper;
using Arkan.Server.Models;
using Arkan.Server.PageModels.QuizModels;
using Microsoft.EntityFrameworkCore;

namespace Arkan.Server.Client_Repositories
{
    public class InstructorQuestionRepository : IInstructorQuestion
    {
        private readonly ApplicationDBContext _context;
        private readonly IBaseRepository _IBaseRepository;
        private readonly ImageHelperInterface _ImageHelper;
        public InstructorQuestionRepository(ApplicationDBContext context, IBaseRepository IBaseRepository, ImageHelperInterface imageHelper)
        {
            _context = context;
            _IBaseRepository = IBaseRepository;
            _ImageHelper = imageHelper;
        }
        public async Task<GetQuestion> AddQuestion(AddQuestionDto model, string userId)
        {
            var quiz = await _context.Quiz.Where(q => q.Id == model.QuizId)
                 .FirstOrDefaultAsync();

            if (quiz == default)
            {
                return new GetQuestion { Key = ResponseKeys.QuizNotFound.ToString() };
            };

            var instructorId = await _IBaseRepository.GetInstructorIdByUserID(userId);

            if (instructorId == 0)
            {
                return new GetQuestion
                {
                    Key = ResponseKeys.UnauthorizedAccess.ToString()
                };
            }

            var isTeachingCourse = await IsTeachingCourse(model.QuizId, instructorId);

            if (!isTeachingCourse)
            {
                return new GetQuestion
                {
                    Key = ResponseKeys.UnauthorizedAccess.ToString()
                };
            }

            var maxOrder = await _context.Question
            .Where(q => q.QuizId == model.QuizId)
            .MaxAsync(q => (int?)q.Order) ?? 0;

            var questionsPointsSum = await _context.Question
                .Where(q => q.QuizId == model.QuizId)
                .SumAsync(q => q.Points);

            var totalPoints = questionsPointsSum + model.Points;

            if (totalPoints > quiz.TotalMarks)
            {
                return new GetQuestion { Key = "Question have uncorrect marks" };
            }

            var question = new Question
            {
                QuizId = model.QuizId,
                Title = model.Title.Trim(),
                Description = model.Description?.Trim(),
                Points = model.Points,
                Order = maxOrder + 1,
            };

            if (model.Image != null)
            {
                var imageTask = _ImageHelper.AddImage(model.Image, ImagesFiles.questions.ToString());
                question.ImageUrl = await imageTask;
            }

            var isQuestionSaved = await _IBaseRepository.AddAsync(question);

            if (!isQuestionSaved)
            {
                return new GetQuestion { Key = ResponseKeys.Failed.ToString() };
            }

            return new GetQuestion
            {
                Id = question.Id,
                Title = question.Title,
                Description = question.Description,
                Points = question.Points,
                Order = question.Order,
                Image = question.ImageUrl,
                Key = ResponseKeys.Success.ToString()
            };
        }
        public async Task<GetQuestion> GetQuestion(int QuestionId,string userId)
        {
            var isQuestionExists = await _IBaseRepository.AnyByIdAsync<Question>(QuestionId);

            if (!isQuestionExists)
            {
                return new GetQuestion { Key = ResponseKeys.LessonNotFound.ToString() };
            };

            var Question = await _IBaseRepository.FindByIdAsync<Question>(QuestionId);

            var instructorId = await _IBaseRepository.GetInstructorIdByUserID(userId);

            if (instructorId == 0)
            {
                return new GetQuestion
                {
                    Key = ResponseKeys.UnauthorizedAccess.ToString()
                };
            }

            var isTeachingCourse = await IsTeachingCourse(Question.QuizId, instructorId);

            if (!isTeachingCourse)
            {
                return new GetQuestion
                {
                    Key = ResponseKeys.UnauthorizedAccess.ToString()
                };
            }

            return new GetQuestion
            {
                Id = Question.Id,
                Title = Question.Title,
                Description = Question.Description,
                Points = Question.Points,
                Order = Question.Order,
                Image = Question.ImageUrl,
                Key = ResponseKeys.Success.ToString()
            };

        }
        public async Task<GetUpdatedQuestion> UpdateQuestion(UpdateQuestionDto model,string userId)
        {
            var isQuestionExists = await _IBaseRepository.AnyByIdAsync<Question>(model.Id);

            if (!isQuestionExists)
            {
                return new GetUpdatedQuestion { Key = ResponseKeys.QuestionNotFound.ToString() };
            };

            var question = await _IBaseRepository.FindByIdAsync<Question>(model.Id);

            var instuctorId = await _IBaseRepository.GetInstructorIdByUserID(userId);

            if (instuctorId == 0)
            {
                return new GetUpdatedQuestion
                {
                    Key = ResponseKeys.UnauthorizedAccess.ToString()
                };
            }

            var isTeachingCourse = await IsTeachingCourse(question.QuizId, instuctorId);

            if (!isTeachingCourse)
            {
                return new GetUpdatedQuestion
                {
                    Key = ResponseKeys.UnauthorizedAccess.ToString()
                };
            }


            var isOrderExists = await _context.Question.AnyAsync(Question => Question.Id != question.Id && Question.QuizId == question.QuizId && Question.Order == model.Order);

            if (isOrderExists)
            {
                return new GetUpdatedQuestion { Key = ResponseKeys.OrderExists.ToString() };
            }

            question.Title = model.Title.Trim();
            question.Description = model.Description.Trim();
            question.Points = model.Points;

            if (model.Image != null && !(model.Image is string))
            {
                if (!string.IsNullOrEmpty(question.ImageUrl))
                {
                    await _ImageHelper.DeleteImage(question.ImageUrl);
                }
                question.ImageUrl = await _ImageHelper.AddImage(model.Image, ImagesFiles.questions.ToString());
            }

            var isQuestionUpdated = _IBaseRepository.Update(question);

            if (!isQuestionUpdated)
            {
                return new GetUpdatedQuestion { Key = ResponseKeys.Failed.ToString() };
            }

            return new GetUpdatedQuestion
            {
                Id = question.Id,
                Title = question.Title,
                Description = question.Description,
                Image = question.ImageUrl,
                Points = question.Points,
                Order = question.Order,
                Key = ResponseKeys.Success.ToString()
            };

        }
        public async Task<string> DeleteQuestion(int QuestionId, string userId)
        {
            var isQuestionExists = await _IBaseRepository.AnyByIdAsync<Question>(QuestionId);

            if (!isQuestionExists)
            {
                return ResponseKeys.QuestionNotFound.ToString();
            };

            var question = await _IBaseRepository.FindByIdAsync<Question>(QuestionId);

            var instructorId = await _IBaseRepository.GetInstructorIdByUserID(userId);

            if (instructorId == 0)
            {
                return ResponseKeys.UnauthorizedAccess.ToString();
            }

            var isTeachingCourse = await IsTeachingCourse(question.QuizId, instructorId);

            if (!isTeachingCourse)
            {
                return ResponseKeys.UnauthorizedAccess.ToString();
            }

            if (!string.IsNullOrEmpty(question.ImageUrl))
            {
                await _ImageHelper.DeleteImage(question.ImageUrl);
            }

            var answersImages = await _context.Answer
             .Where(Answer => Answer.QuestionId == QuestionId && Answer.ImageUrl != null)
             .Select(Question => Question.ImageUrl)
             .ToListAsync();

            foreach (var answerImage in answersImages)
            {
                if (!string.IsNullOrEmpty(answerImage))
                {
                    await _ImageHelper.DeleteImage(answerImage);
                }
            }

            var questionsToReOrder = await _context.Question
            .Where(q => q.QuizId == question.QuizId && q.Order > question.Order)
            .OrderBy(q => q.Order)
            .ToListAsync();

            foreach (var q in questionsToReOrder)
            {
                q.Order--;
            }

            var isQuestionRemoved = _IBaseRepository.Remove(question);

            if (!isQuestionRemoved)
            {
                return ResponseKeys.Failed.ToString();
            }

            return ResponseKeys.Success.ToString();
        }
        public async Task<List<GetQuestions>> GetQuizQuestions(int QuizId, string userId)
        {
            var isQuizExists = await _IBaseRepository.AnyByIdAsync<Quiz>(QuizId);

            if (!isQuizExists)
            {
                return new List<GetQuestions>();
            };

            var instuctorId = await _IBaseRepository.GetInstructorIdByUserID(userId);

            if (instuctorId == 0)
            {
                return new List<GetQuestions>();

            }

            var isTeachingCourse = await IsTeachingCourse(QuizId, instuctorId);

            if (!isTeachingCourse)
            {
                return new List<GetQuestions>();
            }

            var isRandomized = await IsRandomized(QuizId);

            IQueryable<Question> query = _context.Question
                                            .Where(Question => Question.QuizId == QuizId);

            if (!isRandomized)
            {
                query = query.OrderBy(Question => Question.Order);
            }

            return await query.Select(Question => new GetQuestions
            {
                Id = Question.Id,
                Title = Question.Title,
                Description = Question.Description,
                Image = Question.ImageUrl,
                Points = Question.Points,
                Order = Question.Order,
            }).ToListAsync();

        }
        private async Task<bool> IsRandomized(int QuizId)
        {
            var quiz = await _IBaseRepository.FindByIdAsync<Quiz>(QuizId);
            return quiz.IsRandomized;
        }
        private async Task<bool> IsTeachingCourse(int quizId, int InstructorId)
        {
            var courseId = await _context.Quiz
                .Where(q => q.Id == quizId)
                .Select(l => l.Lesson.Chapter.CourseId)
                .FirstOrDefaultAsync();

            var courseInstructorId = await _context.Courses
                .Where(c => c.Id == courseId)
                .Select(c => c.InstructorId)
                .FirstOrDefaultAsync();

            return courseInstructorId == InstructorId;
        }

    }
}