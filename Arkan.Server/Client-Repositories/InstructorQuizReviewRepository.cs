using Arkan.Server.BaseRepository;
using Arkan.Server.Client_Interfaces;
using Arkan.Server.Client_PageModels.Quiz;
using Arkan.Server.Data;
using Arkan.Server.Helpers;
using Microsoft.EntityFrameworkCore;

namespace Arkan.Server.Client_Repositories
{
    public class InstructorQuizReviewRepository: IInstructorQuizReview
    {
        private readonly ApplicationDBContext _context;
        private readonly IBaseRepository _IBaseRepository;
        public InstructorQuizReviewRepository(ApplicationDBContext context, IBaseRepository IBaseRepository)
        {
            _context = context;
            _IBaseRepository = IBaseRepository;
        }

        public async Task<PaginationResult<QuizAttempts>> GetStudentsAttempts(GetStudentsAttempt model , string userId)
        {
            var isTeachingCourse = await IsTeachingCourse(model.QuizId, userId);

            if (!isTeachingCourse)
            {
                return new PaginationResult<QuizAttempts>();
            }

            var query =  _context.UserQuizAttempt
                .Where(uqa => uqa.QuizId == model.QuizId)
                 .WhereIf(model.StudentName != null, uqa => uqa.User.FirstName.ToLower().Contains(model.StudentName.Trim().ToLower())
                          || uqa.User.LastName.ToLower().Contains(model.StudentName.Trim().ToLower()))
                .Select(uqa => new QuizAttempts
                {
                    Id = uqa.Id,
                    QuizName = uqa.Quiz.Title,
                    QuizTotalPoints = uqa.Quiz.Questions.Sum(q => q.Points),
                    Attempts = new StudentAttempts
                    {
                        StudentName = uqa.User.FirstName + uqa.User.LastName,
                        AttemptDate = uqa.StartTime,
                        StudentMark = uqa.Score + " / " + uqa.Quiz.TotalMarks,
                        TimeTaken = FormatTimeTaken((uqa.EndTime.Value - uqa.StartTime).TotalMinutes) + " / " + uqa.Quiz.TimeLimit ,
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
                    }
                }).AsQueryable();

            var paginationResult = await PaginationHelper.PaginateAsync(query, model.PageNumber, model.PageSize);

            return paginationResult;
        }
        private async Task<bool> IsTeachingCourse(int quizId, string userId)
        {
            var quizCourseId = await _context.Quiz
              .Where(q => q.Id == quizId)
              .Select(q => q.Lesson.Chapter.CourseId)
              .FirstOrDefaultAsync();

            var courseInstructorId = await _context.Courses
             .Where(c => c.Id == quizCourseId)
             .Select(c => c.InstructorId)
             .FirstOrDefaultAsync();

            var instructorId = await _IBaseRepository.GetInstructorIdByUserID(userId);

            if (courseInstructorId != instructorId)
            {
                return false;
            }

            return true;
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
