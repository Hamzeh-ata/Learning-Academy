using Arkan.Server.BaseRepository;
using Arkan.Server.Client_PageModels.Quiz;
using Arkan.Server.Data;
using Arkan.Server.Helpers;
using Arkan.Server.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Arkan.Server.Repository
{
    public class QuizStudentsAttemptsRepository : IQuizStudentsAttempts
    {
        private readonly ApplicationDBContext _context;
        public QuizStudentsAttemptsRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task<PaginationResult<StudentAttempts>> GetStudentsAttempts(GetStudentsAttempt model)
        {
            var query = _context.UserQuizAttempt
                .Where(uqa => uqa.QuizId == model.QuizId)
                 .WhereIf(model.StudentName != null, uqa => uqa.User.FirstName.ToLower().Contains(model.StudentName.Trim().ToLower())
                          || uqa.User.LastName.ToLower().Contains(model.StudentName.Trim().ToLower()))
                .Select(uqa => new StudentAttempts
                {
                    Id = uqa.Id,
                    StudentName = uqa.User.FirstName + uqa.User.LastName,
                    AttemptDate = uqa.StartTime,
                    StudentMark = uqa.Score + " / " + uqa.Quiz.TotalMarks,
                    TimeTaken = uqa.EndTime.HasValue ? FormatTimeTaken((uqa.EndTime.Value - uqa.StartTime).TotalMinutes) + " / " + uqa.Quiz.TimeLimit : "0",
                    Questions = uqa.Quiz.Questions.Select(qq => new QuestionsReview
                    {
                        Id = qq.Id,
                        Title = qq.Title,
                        Description = qq.Description,
                        Image = qq.ImageUrl,
                        Points = qq.Points,
                        Answers = qq.Answers.Select(qa => new AnswersReview
                        {
                            Id = qa.Id,
                            Title = qa.Title,
                            Description = qq.Description,
                            Image = qa.ImageUrl,
                            IsCorrect = qa.IsCorrect,
                            IsSelected = _context.UserAnswer.Any(ua => ua.QuestionId == qq.Id && ua.UserQuizAttemptId == uqa.Id && ua.AnswerId == qa.Id),
                        }).ToList()
                    }).ToList(),
                }).AsQueryable();

            var paginationResult = await PaginationHelper.PaginateAsync(query, model.PageNumber, model.PageSize);

            return paginationResult;
        }
        private static string FormatTimeTaken(double timeTaken)
        {
            double totalSeconds = timeTaken * 60;
            int minutes = (int)Math.Floor(totalSeconds / 60);
            int seconds = (int)Math.Round(totalSeconds % 60);
            return $"{minutes}:{seconds:D2}";
        }

    }
}
