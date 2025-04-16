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
    public class QuestionRepository : IQuestionInterface
    {
        private readonly ApplicationDBContext _context;
        private readonly IBaseRepository _IBaseRepository;
        private readonly ImageHelperInterface _ImageHelper;
        public QuestionRepository(ApplicationDBContext context, IBaseRepository IBaseRepository, ImageHelperInterface ImageHelper)
        {
            _context = context;
            _IBaseRepository = IBaseRepository;
            _ImageHelper = ImageHelper;
        }
        public async Task<GetQuestion> AddQuestion(AddQuestionDto model)
        {
            var isQuizExists = await _IBaseRepository.AnyByIdAsync<Quiz>(model.QuizId);

            if (!isQuizExists)
            {
                return new GetQuestion { Key = ResponseKeys.QuizNotFound.ToString() };
            };

            var isOrderExists = await _context.Question.AnyAsync(Question => Question.QuizId == model.QuizId && Question.Order == model.Order);

            if (isOrderExists)
            {
                return new GetQuestion { Key = ResponseKeys.OrderExists.ToString()};
            }


            var question = new Question
            {
                QuizId = model.QuizId,
                Title = model.Title.Trim(),
                Description = model.Description?.Trim(),
                Points = model.Points,
                Order = model.Order
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

            return new GetQuestion {
                Id = question.Id,
                Title = question.Title,
                Description = question.Description,
                Points = question.Points,
                Order = question.Order,
                Image = question.ImageUrl,
                Key = ResponseKeys.Success.ToString() 
            };
        }
        public async Task<GetQuestion> GetQuestion(int QuestionId)
        {
            var isQuestionExists = await _IBaseRepository.AnyByIdAsync<Question>(QuestionId);
            if (!isQuestionExists)
            {
                return new GetQuestion { Key = ResponseKeys.LessonNotFound.ToString() };
            };

            var Question = await _IBaseRepository.FindByIdAsync<Question>(QuestionId);

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
        public async Task<GetUpdatedQuestion> UpdateQuestion(UpdateQuestionDto model)
        {
            var isQuestionExists = await _IBaseRepository.AnyByIdAsync<Question>(model.Id);

            if (!isQuestionExists)
            {
                return  new GetUpdatedQuestion { Key = ResponseKeys.QuestionNotFound.ToString() };
            };

            var question = await _IBaseRepository.FindByIdAsync<Question>(model.Id);

            var isOrderExists = await _context.Question.AnyAsync(Question => Question.Id != question.Id && Question.QuizId==question.QuizId && Question.Order == model.Order);

            if (isOrderExists)
            {
                return new GetUpdatedQuestion { Key = ResponseKeys.OrderExists.ToString() };
            }

            question.Title = model.Title.Trim();
            question.Description = model.Description?.Trim();
            question.Points = model.Points;
            question.Order = model.Order;

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
        public async Task<string> DeleteQuestion(int QuestionId)
        {
            var isQuestionExists = await _IBaseRepository.AnyByIdAsync<Question>(QuestionId);

            if (!isQuestionExists)
            {
                return ResponseKeys.QuestionNotFound.ToString();
            };

            var question = await _IBaseRepository.FindByIdAsync<Question>(QuestionId);

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

            var isQuestionRemoved = _IBaseRepository.Remove(question);

            if (!isQuestionRemoved)
            {
                return ResponseKeys.Failed.ToString();
            }

         

            return ResponseKeys.Success.ToString();



        }
        public async Task<List<GetQuestions>> GetQuizQuestions(int QuizId)
        {
            var isQuizExists = await _IBaseRepository.AnyByIdAsync<Quiz>(QuizId);
            if (!isQuizExists)
            {
                return new List<GetQuestions>();
            };

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
    }
}
