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
    public class InstructorAnswersRepository : IInstructorAnswers
    {
        private readonly ApplicationDBContext _context;
        private readonly IBaseRepository _IBaseRepository;
        private readonly ImageHelperInterface _ImageHelper;
        public InstructorAnswersRepository(ApplicationDBContext context, IBaseRepository IBaseRepository, ImageHelperInterface ImageHelper)
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

            var maxOrder = await _context.Answer
            .Where(q => q.QuestionId == model.QuestionId)
            .MaxAsync(q => (int?)q.Order) ?? 0;

            var answer = new Answer
            {
                QuestionId = model.QuestionId,
                Title = model.Title?.Trim(),
                Description = model.Description?.Trim(),
                IsCorrect = model.IsCorrect,
                Order = maxOrder + 1,
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

            if (answer.Description != null && answer.Description != "null") {
                answer.Description = model.Description?.Trim();
            }

            answer.Title = model.Title?.Trim();
            answer.IsCorrect = model.IsCorrect;

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


            var answersToReOrder = await _context.Answer
            .Where(q => q.QuestionId == answer.QuestionId && q.Order > answer.Order)
            .OrderBy(q => q.Order)
            .ToListAsync();

            foreach (var a in answersToReOrder)
            {
                a.Order--;
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
