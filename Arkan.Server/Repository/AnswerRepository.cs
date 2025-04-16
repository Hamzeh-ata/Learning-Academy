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
    public class AnswerRepository: IAnswerInterface
    {
        private readonly ApplicationDBContext _context;
        private readonly IBaseRepository _IBaseRepository;
        private readonly ImageHelperInterface _ImageHelper;
        public AnswerRepository(ApplicationDBContext context, IBaseRepository IBaseRepository, ImageHelperInterface ImageHelper)
        {
            _context = context;
            _IBaseRepository = IBaseRepository;
            _ImageHelper = ImageHelper;
        }
        public async Task<GetAnswer> AddAnswer(AddAnswersDto model)
        {
            var isQuestionExists = await _IBaseRepository.AnyByIdAsync<Question>(model.QuestionId);

            if (!isQuestionExists)
            {
                return new GetAnswer
                {

                    Key = ResponseKeys.QuestionNotFound.ToString()

                };
            };

            var isOrderExists = await _context.Answer.AnyAsync(Answer => Answer.QuestionId == model.QuestionId && Answer.Order == model.Order);

            if (isOrderExists)
            {
                return new GetAnswer { Key = ResponseKeys.OrderExists.ToString() };
            }


            var answer = new Answer
            {
                QuestionId = model.QuestionId,
                Title = model.Title,
                Description = model.Description,
                IsCorrect = model.IsCorrect,
                Order = model.Order
            };

            if (model.Image != null)
            {
                var imageTask = _ImageHelper.AddImage(model.Image, ImagesFiles.answers.ToString());
                answer.ImageUrl = await imageTask;
            }

            var isAnswerAdded = await _IBaseRepository.AddAsync(answer);


            if (!isAnswerAdded)
            {
                return new GetAnswer
                {
                    Key = ResponseKeys.Failed.ToString()
                };
            };

         
            return new GetAnswer
            {
                Id = answer.Id,
                Title = answer.Title,
                Description = answer.Description,
                IsCorrect = answer.IsCorrect,
                Order = answer.Order,
                Image = answer.ImageUrl,
                Key = ResponseKeys.Success.ToString()
            };

        }
        public async Task<GetAnswer> UpdateAnswer(UpdateAnswer model)
        {
            var isAnswerExists = await _IBaseRepository.AnyByIdAsync<Answer>(model.Id);
            if (!isAnswerExists)
            {
                return new GetAnswer { Key = ResponseKeys.LessonNotFound.ToString() };
            };

            var answer = await _IBaseRepository.FindByIdAsync<Answer>(model.Id);

            var isOrderExists = await _context.Answer.AnyAsync(Answer => Answer.Id != answer.Id && Answer.QuestionId==answer.QuestionId && Answer.Order == model.Order);

            if (isOrderExists)
            {
                return new GetAnswer { Key = ResponseKeys.OrderExists.ToString() };
            }



            answer.Title = model.Title;
            answer.Description = model.Description;
            answer.IsCorrect = model.IsCorrect;
            answer.Order = model.Order;

            if (model.Image != null && !(model.Image is string))
            {
                if (!string.IsNullOrEmpty(answer.ImageUrl))
                {
                    await _ImageHelper.DeleteImage(answer.ImageUrl);
                }
                answer.ImageUrl = await _ImageHelper.AddImage(model.Image, ImagesFiles.questions.ToString());
            }

            var isAnswerUpdated = _IBaseRepository.Update(answer);

            if (!isAnswerUpdated)
            {
                return new GetAnswer { Key = ResponseKeys.Failed.ToString() };
            }

            return new GetAnswer
            {
                Id = answer.Id,
                Title = answer.Title,
                IsCorrect = answer.IsCorrect,
                Description = answer.Description,
                Image = answer.ImageUrl,
                Order = answer.Order,
                Key = ResponseKeys.Success.ToString()
            };

        }
        public async Task<string> DeleteAnswer(int AnswerId)
        {
            var isAnswerExists = await _IBaseRepository.AnyByIdAsync<Answer>(AnswerId);

            if (!isAnswerExists)
            {
                return ResponseKeys.AnswerNotFound.ToString();
            };

            var answer = await _IBaseRepository.FindByIdAsync<Answer>(AnswerId);

            if (!string.IsNullOrEmpty(answer.ImageUrl))
            {
                await _ImageHelper.DeleteImage(answer.ImageUrl);
            }

            var isAnswerRemoved = _IBaseRepository.Remove(answer);

            if (!isAnswerRemoved)
            {
                return ResponseKeys.Failed.ToString();
            }

            return ResponseKeys.Success.ToString();
        }
        public async Task<List<GetAnswers>> GetQuestionAnswers(int QuestionId)
        {
            var isQuestionExists = await _IBaseRepository.AnyByIdAsync<Question>(QuestionId);

            if (!isQuestionExists)
            {
                return new List<GetAnswers>();
            };

            var question = await _IBaseRepository.FindByIdAsync<Question>(QuestionId);

            var isRandomized = await IsRandomized(question.QuizId);


            IQueryable<Answer> query = _context.Answer
                                         .Where(Answer => Answer.QuestionId == QuestionId);

            if (!isRandomized)
            {
                query = query.OrderBy(Answer => Answer.Order);
            }


            return await query.Select(Answer => new GetAnswers
            {
                Id = Answer.Id,
                Title = Answer.Title,
                Description = Answer.Description,
                Image = Answer.ImageUrl,
                Order = Answer.Order,
                IsCorrect = Answer.IsCorrect
            }).ToListAsync();
        }
        private async Task<bool> IsRandomized(int QuizId)
        {
            var quiz = await _IBaseRepository.FindByIdAsync<Quiz>(QuizId);
            return quiz.IsRandomized;
        }

    }
}
