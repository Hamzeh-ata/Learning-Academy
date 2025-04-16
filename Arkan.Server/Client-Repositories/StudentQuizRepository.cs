using Arkan.Server.BaseRepository;
using Arkan.Server.Client_Interfaces;
using Arkan.Server.Client_PageModels.Quiz;
using Arkan.Server.Data;
using Arkan.Server.Enums;
using Arkan.Server.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query.Internal;

namespace Arkan.Server.Client_Repositories
{
    public class StudentQuizRepository : IStudentQuizRepository
    {
        private readonly ApplicationDBContext _context;
        private readonly IBaseRepository _IBaseRepository;
        public StudentQuizRepository(ApplicationDBContext context, IBaseRepository IBaseRepository)
        {
            _context = context;
            _IBaseRepository = IBaseRepository;
        }

        public async Task<GetQuiz> StartQuiz(int lessonId, string userId)
        {
            var isLessonExists = await _IBaseRepository.AnyByIdAsync<Lesson>(lessonId);

            if (!isLessonExists)
            {
                return new GetQuiz
                {
                    Key = ResponseKeys.LessonNotFound.ToString()
                };
            }

            var lesson = await _IBaseRepository.FindByIdAsync<Lesson>(lessonId);

            var chapterId = lesson.ChapterId;

            var (courseName, courseId) = await FindCourseByChapterId(chapterId);


            var studentId = await _IBaseRepository.GetStudentIdByUserId(userId);

            if (studentId == 0)
            {
                return new GetQuiz
                {
                    Key = ResponseKeys.UserNotFound.ToString()
                };
            }

            var isStudentEnrolled = await IsStudentEnrollInCourse(courseId, studentId);

            if (!lesson.IsFree && !isStudentEnrolled)
            {
                return new GetQuiz
                {
                    Key = ResponseKeys.UnauthorizedAccess.ToString()
                };
            }

            var isLessonCompleted = await _context.StudentWatchedLessons.AnyAsync(swl => swl.StudentId == studentId && lessonId == swl.LessonId);

            var quiz = await _context.Quiz
                .Where(q => q.LessonId == lessonId)
                .Include(q => q.Questions)
                .ThenInclude(qq => qq.Answers)
                .FirstOrDefaultAsync();

            if (quiz is null)
            {
                return new GetQuiz
                {
                    Key = ResponseKeys.QuizNotFound.ToString()
                };
            }

            var isAttemptedBefore = await CheckForAttempt(quiz.Id, userId);

            if (isAttemptedBefore)
            {
                var attemptRemoved = await RemoveAttempt(quiz.Id, userId);

                if (!attemptRemoved)
                {
                    return new GetQuiz
                    {
                        Key = ResponseKeys.Failed.ToString()
                    };
                }
            }


            DateTime utcNow = DateTime.UtcNow;

            // Convert UTC time to Jordan time
            TimeZoneInfo jordanTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Jordan Standard Time");

            DateTime jordanTime = TimeZoneInfo.ConvertTimeFromUtc(utcNow, jordanTimeZone);


            var startAttempt = new UserQuizAttempt
            {
                UserId = userId,
                QuizId = quiz.Id,
                StartTime = jordanTime,
            };

            var isAttemptAdded = await _IBaseRepository.AddAsync(startAttempt);

            if (!isAttemptAdded)
            {
                return new GetQuiz
                {
                    Key = ResponseKeys.Failed.ToString()
                };
            }

            return new GetQuiz
            {
                LessonName = lesson.Name,
                QuizId = quiz.Id,
                QuizName = quiz.Title,
                TimeLimit = quiz.TimeLimit,
                Questions = quiz.IsRandomized ? quiz.Questions.Select(qq => new QuizQuestions
                {
                    Id = qq.Id,
                    Title = qq.Title,
                    Description = qq.Description,
                    Points = qq.ShowPoints ? qq.Points : 0,
                    Image = qq.ImageUrl,
                    Answers = quiz.IsRandomized ?
                        qq.Answers.Select(qa => new QuestionAnswers
                        {
                            Id = qa.Id,
                            Title = qa.Title,
                            Description = qa.Description,
                            Image = qa.ImageUrl,
                            IsCorrect = qa.IsCorrect
                        }).OrderBy(_ => Guid.NewGuid()).ToList() :
                        qq.Answers.OrderBy(qa => qa.Order).Select(qa => new QuestionAnswers
                        {
                            Id = qa.Id,
                            Title = qa.Title,
                            Description = qa.Description,
                            Image = qa.ImageUrl,
                            IsCorrect = qa.IsCorrect
                        }).ToList()
                }).OrderBy(_ => Guid.NewGuid()).ToList() : quiz.Questions.Select(qq => new QuizQuestions
                {
                    Id = qq.Id,
                    Title = qq.Title,
                    Description = qq.Description,
                    Points = qq.ShowPoints ? qq.Points : 0,
                    Image = qq.ImageUrl,
                    Answers = quiz.IsRandomized ?
                        qq.Answers.Select(qa => new QuestionAnswers
                        {
                            Id = qa.Id,
                            Title = qa.Title,
                            Description = qa.Description,
                            Image = qa.ImageUrl,
                            IsCorrect = qa.IsCorrect
                        }).OrderBy(_ => Guid.NewGuid()).ToList() :
                        qq.Answers.OrderBy(qa => qa.Order).Select(qa => new QuestionAnswers
                        {
                            Id = qa.Id,
                            Title = qa.Title,
                            Description = qa.Description,
                            Image = qa.ImageUrl,
                            IsCorrect = qa.IsCorrect
                        }).ToList()
                }).ToList(),
                Key = ResponseKeys.Success.ToString()
            };
        }
        public async Task<string> RemoveAttempet(int quizId, string userId)
        {
            var isAttemptedBefore = await _context.UserQuizAttempt.AnyAsync(uqa => uqa.UserId == userId && uqa.QuizId == quizId);

            if (!isAttemptedBefore)
            {
                return ResponseKeys.Failed.ToString();
            }

            var attempt = await _context.UserQuizAttempt.Where(uqa => uqa.UserId == userId && uqa.QuizId == quizId).FirstAsync();

            var isRemoved = _IBaseRepository.Remove<UserQuizAttempt>(attempt);

            if (!isRemoved)
            {
                return ResponseKeys.Failed.ToString();
            }

            return ResponseKeys.Success.ToString();
        }
        public async Task<string> SubmitAnswer(SubmitAnswer model, string userId)
        {
            var userAttempet = await _context.UserQuizAttempt
                .Where(uqa => uqa.UserId == userId && uqa.QuizId == model.QuizId)
                .Select(uqa => new { uqa.Id, uqa.StartTime })
                .FirstOrDefaultAsync();

            if (userAttempet is null)
            {
                return ResponseKeys.Failed.ToString();
            }

            var quiz = await _context.Quiz
                .Where(q => q.Id == model.QuizId)
                .Select(q => new
                {
                    q.TimeLimit
                })
                .FirstOrDefaultAsync();


            DateTime utcNow = DateTime.UtcNow;

            // Convert UTC time to Jordan time
            TimeZoneInfo jordanTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Jordan Standard Time");

            DateTime jordanTime = TimeZoneInfo.ConvertTimeFromUtc(utcNow, jordanTimeZone);

            var userAnswer = new UserAnswer
            {
                UserQuizAttemptId = userAttempet.Id,
                QuestionId = model.QuestionId,
                AnswerId = model.AnswerId != 0 ? model.AnswerId : null,
                SubmissionTime = jordanTime,
            };

            var isAnswerAdded = await _IBaseRepository.AddAsync(userAnswer);

            if (!isAnswerAdded)
            {
                return ResponseKeys.Failed.ToString();
            }

            return ResponseKeys.Success.ToString();
        }
        public async Task<SubmittedQuiz> FinishQuiz(int quizId, string userId)
        {
            var quiz = await _context.Quiz
               .Include(q => q.Questions)
               .ThenInclude(q => q.Answers)
               .FirstOrDefaultAsync(q => q.Id == quizId);

            if (quiz is null)
            {
                return new SubmittedQuiz
                {
                    Key = ResponseKeys.QuizNotFound.ToString()
                };
            }

            var quizAttempt = await _context.UserQuizAttempt
                .Where(uqa => uqa.QuizId == quizId && uqa.UserId == userId)
                .FirstOrDefaultAsync();

            if (quizAttempt == null)
            {
                return new SubmittedQuiz
                {
                    Key = ResponseKeys.QuizAttemptNotFound.ToString()
                };
            }

            var quizStartTime = quizAttempt.StartTime;

            DateTime utcNow = DateTime.UtcNow;

            // Convert UTC time to Jordan time
            TimeZoneInfo jordanTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Jordan Standard Time");

            DateTime jordanTime = TimeZoneInfo.ConvertTimeFromUtc(utcNow, jordanTimeZone);

            var timeTaken = (jordanTime - quizStartTime).TotalMinutes;


            int answeredQuestionsCount = 0;
            double studentTotalPoints = 0;
            int correctAnswersCount = 0;
            int wrongAnswersCount = 0;

            var userQuizAnswers = await _context.UserAnswer
                    .Where(ua => ua.UserQuizAttemptId == quizAttempt.Id)
                    .Select(ua => new
                    {
                        ua.AnswerId,
                        ua.QuestionId
                    })
                    .ToListAsync();

            foreach (var question in quiz.Questions)
            {
                var userQuestionAnswer = userQuizAnswers
                    .Where(uqa => uqa.QuestionId == question.Id)
                    .Select(uqa => uqa.AnswerId)
                    .FirstOrDefault();

                if (userQuestionAnswer != 0 && userQuestionAnswer != null)
                {
                    answeredQuestionsCount++;

                    var (IsCorrect, Points) = await EvaluateAnswer(question, userQuestionAnswer);

                    if (IsCorrect)
                    {
                        correctAnswersCount++;

                        studentTotalPoints += Points;
                    }
                    else
                    {
                        wrongAnswersCount++;
                    }
                }

            }

            quizAttempt.Score = studentTotalPoints;
            quizAttempt.EndTime = jordanTime;

            var isUpdated = _IBaseRepository.Update<UserQuizAttempt>(quizAttempt);

            if (!isUpdated)
            {
                return new SubmittedQuiz
                {
                    Key = ResponseKeys.Failed.ToString()
                };
            }

            string formattedTimeTaken = FormatTimeTaken(timeTaken);

            return new SubmittedQuiz
            {
                QuizId = quiz.Id,
                QuizName = quiz.Title,
                QuizTotalPoints = quiz.Questions.Sum(q => q.Points),
                QuestionsCount = quiz.Questions.Count,
                AnsweredQuestionsCount = answeredQuestionsCount,
                CorrectAnswersCount = correctAnswersCount,
                StudentTotalPoints = studentTotalPoints,
                WrongAnswersCount = wrongAnswersCount,
                TimeTaken = formattedTimeTaken,
                Key = ResponseKeys.Success.ToString()
            };

        }
        public async Task<QuizReview> QuizReview(int quizId, string userId)
        {
            var quizAttempt = await _context.UserQuizAttempt
               .Where(uqa => uqa.QuizId == quizId && uqa.UserId == userId)
               .FirstOrDefaultAsync();

            if (quizAttempt == null)
            {
                return new QuizReview
                {
                    Key = ResponseKeys.QuizAttemptNotFound.ToString()
                };
            }

            var quiz = await _context.Quiz
              .Include(q => q.Questions)
              .ThenInclude(q => q.Answers)
              .FirstOrDefaultAsync(q => q.Id == quizId);

            if (quiz is null)
            {
                return new QuizReview
                {
                    Key = ResponseKeys.QuizNotFound.ToString()
                };
            }

            var quizStartTime = quizAttempt.StartTime;
            var quizEndTime = quizAttempt.EndTime;

            var formattedTimeTaken = "";

            if (quizEndTime.HasValue)
            {
                var timeTaken = (quizEndTime.Value - quizStartTime).TotalMinutes;
                formattedTimeTaken = FormatTimeTaken(timeTaken);
            }

            var userQuizAnswers = await _context.UserAnswer
                 .Where(ua => ua.UserQuizAttemptId == quizAttempt.Id)
                 .Select(ua => new
                 {
                     ua.AnswerId,
                     ua.QuestionId
                 })
                 .ToListAsync();


            return new QuizReview
            {
                Id = quiz.Id,
                Name = quiz.Title,
                QuizTotalPoints = quiz.Questions.Sum(q => q.Points),
                TimeTaken = formattedTimeTaken,
                StudentMark = quizAttempt.Score,
                Questions = quiz.Questions.Select(qq => new QuestionsReview
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
                        IsSelected = userQuizAnswers.Any(uqa => uqa.QuestionId == qq.Id && uqa.AnswerId == qa.Id)
                    }).ToList()
                }).ToList(),
                Key = ResponseKeys.Success.ToString()
            };


        }
        private async Task<bool> CheckForAttempt(int quizId, string userId)
        {
            return await _context.UserQuizAttempt.AnyAsync(uqa => uqa.UserId == userId && uqa.QuizId == quizId);
        }
        private async Task<bool> RemoveAttempt(int quizId, string userId)
        {
            var attempt = await _context.UserQuizAttempt.Where(uqa => uqa.UserId == userId && uqa.QuizId == quizId).FirstOrDefaultAsync();

            return _IBaseRepository.Remove<UserQuizAttempt>(attempt);
        }
        private async Task<(bool IsCorrect, double Points)> EvaluateAnswer(Question question, int? answerId)
        {
            if (answerId == null)
            {
                return (false, 0);
            }

            bool isCorrect = question.Answers.Any(a => a.Id == answerId && a.IsCorrect);

            double points = isCorrect ? question.Points : 0;

            return (isCorrect, question.Points);

        }
        private async Task<(string courseName, int courseId)> FindCourseByChapterId(int chapterId)
        {
            var courseId = await _context.Chapters
                .Where(c => c.Id == chapterId)
                .Select(c => c.CourseId)
                .FirstOrDefaultAsync();

            var courseName = await _context.Courses
                .Where(c => c.Id == courseId)
                .Select(c => c.Name)
                .FirstOrDefaultAsync();

            return (courseName, courseId);
        }
        private async Task<bool> IsStudentEnrollInCourse(int courseId, int studentId)
        {
            var isEnroll = await _context.Enrollments.AnyAsync(e => e.CourseId == courseId && e.StudentId == studentId);
            return isEnroll;
        }
        private string FormatTimeTaken(double timeTaken)
        {
            double totalSeconds = timeTaken * 60;
            int minutes = (int)Math.Floor(totalSeconds / 60);
            int seconds = (int)Math.Round(totalSeconds % 60);
            return $"{minutes}:{seconds:D2}";
        }
    }
}
