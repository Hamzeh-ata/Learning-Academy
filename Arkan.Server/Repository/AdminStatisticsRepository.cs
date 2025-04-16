using Arkan.Server.BaseRepository;
using Arkan.Server.Data;
using Arkan.Server.Enums;
using Arkan.Server.Helpers;
using Arkan.Server.ImagesHelper;
using Arkan.Server.Interfaces;
using Arkan.Server.Models;
using Arkan.Server.PageModels.OrdersModels;
using Arkan.Server.PageModels.Statistics;
using Microsoft.EntityFrameworkCore;
using System.Drawing.Printing;

namespace Arkan.Server.Repository
{
    public class AdminStatisticsRepository : IAdminStatistics
    {
        private readonly ApplicationDBContext _context;
        private readonly IBaseRepository _IBaseRepository;
        public AdminStatisticsRepository(ApplicationDBContext context, IBaseRepository IBaseRepository)
        {
            _context = context;
            _IBaseRepository = IBaseRepository;
        }

        public async Task<Statistics> GetStatistics()
        {
            int studentsCount = await _context.Students.CountAsync();
            int instructorsCount = await _context.Instructors.CountAsync();
            int coursesCount = await _context.Courses.CountAsync();

            return new Statistics
            {
                StudentsCount = studentsCount,
                InstructorsCount = instructorsCount,
                CoursesCount = coursesCount
            };
        }


        /* Instructor Statistics */
        public async Task<InstructorStatistics> GetInstructorStatistics(string userId)
        {
            var instructorId = await _IBaseRepository.GetInstructorIdByUserID(userId);

            if (instructorId == 0)
            {
                return new InstructorStatistics();
            }

            int coursesCount = await GetInstructorCoursesCount(instructorId);

            int studentsCount = await GetInstructorStudentsCount(instructorId);

            int lessonsCount = await GetInstructorLessonsCount(instructorId);

            return new InstructorStatistics
            {
                CoursesCount = coursesCount,
                StudentsCount = studentsCount,
                LessonsCount = lessonsCount
            };
        }
        private async Task<int> GetInstructorCoursesCount(int instructorId)
        {
            return await _context.Courses
                .Where(c => c.InstructorId == instructorId)
                .CountAsync();
        }
        private async Task<int> GetInstructorStudentsCount(int instructorId)
        {
            var studentsCount = await _context.Courses
                .Where(c => c.InstructorId == instructorId)
                .SelectMany(c => c.Enrollments)
                .CountAsync();

            return studentsCount;
        }
        private async Task<int> GetInstructorLessonsCount(int instructorId)
        {
            var lessonsCount = await _context.Lessons
                .Where(l => _context.Courses
                    .Where(c => c.InstructorId == instructorId)
                    .SelectMany(c => c.Chapters)
                    .Select(ch => ch.Id)
                    .Contains(l.ChapterId))
                .CountAsync();

            return lessonsCount;
        }


        /* Course Statistics */
        public async Task<CourseStatistics> GetCourseStatistics(int courseId)
        {
            var courseExists = await _IBaseRepository.AnyByIdAsync<Course>(courseId);

            if (!courseExists)
            {
                return new CourseStatistics();
            }

            var course = await _context.Courses
                .Include(c=> c.Enrollments)
                .Include(c => c.Chapters)
                    .ThenInclude(ch => ch.Lessons)
                        .ThenInclude(l => l.Quiz)
                .FirstAsync(c => c.Id == courseId);

            int studentsCount = course.Enrollments.Count;
            int chaptersCount = course.Chapters.Count;
            int lessonsCount = course.Chapters.Sum(ch => ch.Lessons.Count);
            int quizzesCount = course.Chapters.Sum(ch => ch.Lessons.Count(l => l.Quiz != null));

            return new CourseStatistics
            {
                StudentsCount = studentsCount,
                ChaptersCount = chaptersCount,
                LessonsCount = lessonsCount,
                QuizzesCount = quizzesCount
            };
        }

        /* Student Statistics */

        public async Task<StudentsStatistics> GetStudentStatistics(string userId)
        {
            var studentId = await _IBaseRepository.GetStudentIdByUserId(userId);

            int coursesCount = await _context.Enrollments
                .Where(e => e.StudentId == studentId)
                .CountAsync();

            double paymentsAmount = await GetStudentPaymentsAmount(userId);

            int completedLessonsCount = await _context.StudentWatchedLessons
                .Where(swl => swl.StudentId == studentId)
                .CountAsync();

            return new StudentsStatistics
            {
                CoursesCount = coursesCount,
                Payments = paymentsAmount,
                CompletedLessonsCount = completedLessonsCount,
            };
        }
        private async Task<double> GetStudentPaymentsAmount(string userId)
        {
            var userOrders = await _context.UserOrder
                .Where(uo => uo.UserId == userId)
                .Select(uo => uo.Id)
                .ToListAsync();

            var userPayments = await _context.OrderPayments
                .Where(op => userOrders.Contains(op.OrderId))
                .SumAsync(op => op.AmountPaid);

            return userPayments;
        }


        /* Orders Statistics */
        public async Task<List<GetPendingOrders>> GetOrdersStatistics(DateTime FromDate, DateTime ToDate)
        {

            if (FromDate == default)
            {
                FromDate = DateTime.Today.AddDays(-1);
            }
            if (ToDate == default)
            {
                ToDate = DateTime.Today;
            }

            var query = await _context.UserOrder
                .Where(uo => uo.OrderDate >= FromDate && uo.OrderDate <= ToDate)
               .Include(uo => uo.OrderItems)
               .Select(uo => new GetPendingOrders
               {
                   Id = uo.Id,
                   UserName = $"{uo.User.FirstName} {uo.User.LastName}",
                   UserPhone = uo.User.PhoneNumber,
                   OrderDate = uo.OrderDate,
                   Items = uo.OrderItems.Select(oi => new OrdersItems
                   {
                       Id = oi.Id,
                       Name = oi.Type == ItemTypes.Course ? _context.Courses.Where(c => c.Id == oi.ItemId).Select(c => c.Name).FirstOrDefault() ?? "Unknown Course" :
                              oi.Type == ItemTypes.Package ? _context.Package.Where(p => p.Id == oi.ItemId).Select(p => p.Name).FirstOrDefault() ?? "Unknown Package" :
                             "Unknown Item Type",
                       Price = oi.Price,
                       Type = oi.Type.ToString(),
                       Code = oi.Code

                   }).ToList(),
                   Amount = uo.Amount,
                   DiscountAmount = uo.DiscountAmount,
                   PromoCode = uo.PromoCode
               })
               .OrderByDescending(uo => uo.OrderDate)
               .ToListAsync();

            return query;
        }

    }

}
