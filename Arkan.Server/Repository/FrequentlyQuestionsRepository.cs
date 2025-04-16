using Arkan.Server.BaseRepository;
using Arkan.Server.Data;
using Arkan.Server.Enums;
using Arkan.Server.Interfaces;
using Arkan.Server.Models;
using Arkan.Server.PageModels.FrequentlyQuestions;
using Microsoft.EntityFrameworkCore;

namespace Arkan.Server.Repository
{
    public class FrequentlyQuestionsRepository : IFrequentlyQuestions
    {

        private readonly ApplicationDBContext _context;
        private readonly IBaseRepository _IBaseRepository;
        public FrequentlyQuestionsRepository(ApplicationDBContext context, IBaseRepository IBaseRepository)
        {
            _context = context;
            _IBaseRepository = IBaseRepository;
        }

        public async Task<GetFrequentlyQuestion> AddQuestion(string title, string answer)
        {
            var titleExists = await _context.FrequentlyQuestions.AnyAsync(fq => fq.Title == title);

            if (titleExists)
            {
                return new GetFrequentlyQuestion
                {
                    Key = ResponseKeys.AlreadyExists.ToString()
                };
            }

            var question = new FrequentlyQuestions
            {
                Title = title.Trim(),
                Answer = answer.Trim()
            };

            await _IBaseRepository.AddAsync<FrequentlyQuestions>(question);

            return new GetFrequentlyQuestion
            {
                Id = question.Id,
                Title = question.Title,
                Answer = question.Answer,
                Key = ResponseKeys.Success.ToString()
            };

        }

        public async Task<GetFrequentlyQuestion> UpdateQuestion(int id,string title, string answer)
        {
            var titleExists = await _context.FrequentlyQuestions.AnyAsync(fq => fq.Title == title && fq.Id != id);

            if (titleExists)
            {
                return new GetFrequentlyQuestion
                {
                    Key = ResponseKeys.AlreadyExists.ToString()
                };
            }

            var question = await _context.FrequentlyQuestions
                .Where(fq => fq.Id == id).FirstOrDefaultAsync();

            if (question == null)
            {
                return new GetFrequentlyQuestion
                {
                    Key = ResponseKeys.NotFound.ToString()
                };
            }


            question.Title = title.Trim();
            question.Answer = answer.Trim();

            _IBaseRepository.Update<FrequentlyQuestions>(question);

            return new GetFrequentlyQuestion
            {
                Id = question.Id,
                Title = question.Title,
                Answer = question.Answer,
                Key = ResponseKeys.Success.ToString()
            };

        }

        public async Task<string> DeleteQuestion(int id)
        {
            var question = await _context.FrequentlyQuestions
            .Where(fq => fq.Id == id).FirstOrDefaultAsync();

            if (question == null)
            {
                return ResponseKeys.NotFound.ToString();
            }

            _IBaseRepository.Remove<FrequentlyQuestions>(question);

            return ResponseKeys.Success.ToString();
        }

        public async Task<GetFrequentlyQuestion> GetQuestionById(int id)
        {
            var question = await _context.FrequentlyQuestions
           .Where(fq => fq.Id == id).FirstOrDefaultAsync();

            if (question == null)
            {
                return new GetFrequentlyQuestion
                {
                    Key = ResponseKeys.NotFound.ToString()
                };
            }

            return new GetFrequentlyQuestion
            {
                Id = question.Id,
                Title = question.Title,
                Answer = question.Answer,
                Key = ResponseKeys.Success.ToString()
            };
        }

        public async Task<List<GetFrequentlyQuestion>> GetAllQuestions()
        {
           var questions = await _context.FrequentlyQuestions
            .Select(fq => new GetFrequentlyQuestion
            {
                Id = fq.Id,
                Title = fq.Title,
                Answer = fq.Answer,
                Key = ResponseKeys.Success.ToString()
            }).ToListAsync();

            return questions;
        }
    }
}
