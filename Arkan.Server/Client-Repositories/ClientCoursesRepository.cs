using Arkan.Server.BaseRepository;
using Arkan.Server.Client_Interfaces;
using Arkan.Server.Client_PageModels.Courses;
using Arkan.Server.Data;
using Arkan.Server.Enums;
using Arkan.Server.Helpers;
using Arkan.Server.Models;
using Arkan.Server.PageModels.CourseModels;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace Arkan.Server.Client_Repositories
{
    public class ClientCoursesRepository : IClientCourses
    {
        private readonly ApplicationDBContext _context;
        public ClientCoursesRepository(ApplicationDBContext context)
        {
            _context = context;
        }
        public async Task<PaginationResult<GetAllCourses>> GetAllCourses(int PageNumber, int PageSize)
        {
            var query = _context.Courses
                .Where(c => c.Status == CourseStatus.Active)
                .Include(course => course.CoursesUnviersites)
                 .ThenInclude(cu => cu.University)
                .Select(c => new GetAllCourses
                {
                    Id = c.Id,
                    Name = c.Name,
                    Description = c.Description,
                    InstructorId = c.InstructorId,
                    InstructorName = c.Instructor != null ? $"{c.Instructor.User.FirstName} {c.Instructor.User.LastName}" : null,
                    Price = c.Price,
                    DiscountPrice = c.DiscountPrice,
                    Image = c.Image,
                    ChaptersCount = c.Chapters.Count,
                    LessonsCount = _context.Lessons.Count(lesson => lesson.Chapter.CourseId == c.Id),
                    EnrollmentsCount = c.Enrollments.Count,
                    Universities = c.CoursesUnviersites.Select(cu => cu.University.Name).ToList(),
                }).AsQueryable();

            var paginationResult = await PaginationHelper.PaginateAsync(query, PageNumber, PageSize);

            return paginationResult;
        }
        public async Task<GetCourse> GetCourse(int CourseId, string? UserId)
        {
            var course = await _context.Courses
                .Where(c => c.Id == CourseId)
                .Include(c => c.Instructor)
                .ThenInclude(cs => cs.User)
                .Include(c => c.Enrollments)
                .FirstOrDefaultAsync();

            if (course is null)
            {
                return new GetCourse
                {
                    Key = ResponseKeys.CourseNotFound.ToString()
                };
            }

            var courseUnviersties = await GetCourseUnviersties(course.Id);
            var courseCategories = await GetCourseCategoris(course.Id);

            if (UserId is null)
            {
                return CreateGetCourseResponse(course, courseUnviersties, courseCategories);
            }

            var userType = await GetUserType(UserId);

            var isPending = await IsCoursePending(CourseId, UserId);
            var isInCart = await IsCourseInCart(CourseId, UserId);

            if (userType == Roles.Student.ToString())
            {
                var studentId = await GetStudentIdByUserID(UserId);
                var isStudentEnroll = await IsEnroll(CourseId, studentId);

                if (isStudentEnroll)
                {
                    return CreateGetCourseResponse(course, courseUnviersties, courseCategories, isEnroll: true, isPending: isPending, isInCart: isInCart);
                }
            }

            else if (userType == Roles.Instructor.ToString())
            {
                var instructorId = await GetInstructorIdByUserID(UserId);
                var editable = course.InstructorId == instructorId;

                return CreateGetCourseResponse(course, courseUnviersties, courseCategories, editable: editable);
            }

            return CreateGetCourseResponse(course, courseUnviersties, courseCategories, isPending: isPending, isInCart: isInCart);
        }
        public async Task<PaginationResult<GetAllCourses>> FilterCourses(ClientCourseFilterModel filters)
        {
            var query = _context.Courses
                 .Where(c => c.Status == CourseStatus.Active)
                 .Include(course => course.CoursesUnviersites)
                 .ThenInclude(cu => cu.University)
                 .Select(course => new FilterCourse
                 {
                     Id = course.Id,
                     Image = course.Image,
                     Name = course.Name,
                     Price = course.Price,
                     InstructorId = course.InstructorId ?? 0,
                     StudentsCount = course.Enrollments.Count,
                     Enrollments = course.Enrollments,
                     InstructorName = course.InstructorId != null ? course.Instructor.User.FirstName + " " + course.Instructor.User.LastName : null,
                     DiscountPrice = course.DiscountPrice,
                     OffLinePrice = course.DirectPrice,
                     Description = course.Description,
                     CoursesPackages = course.CoursesPackages,
                     CoursesUnviersites = course.CoursesUnviersites,
                     CoursesCategories = course.CoursesCategories,
                     ChaptersCount = course.Chapters.Count,
                     Status = course.Status.ToString()
                 }).AsQueryable();


            switch (filters.SortOrder?.ToLower())
            {
                case "asc":
                    query = query.OrderBy(GetOrderByExpression(filters.SortBy));
                    break;
                case "desc":
                    query = query.OrderByDescending(GetOrderByExpression(filters.SortBy));
                    break;
                default:
                    break;
            }

            var studentId = filters.StudentId != null ? await GetStudentIdByUserID(filters.StudentId) : 0;
            var instructorId = filters.InstructorId == null && filters.InstructorUserId!= null ? await GetInstructorIdByUserID(filters.InstructorUserId) : filters.InstructorId;

            query = query.WhereIf(!string.IsNullOrEmpty(filters.CourseName), c => c.Name.ToLower().Contains(filters.CourseName.ToLower()))
              .WhereIf(instructorId != 0 && instructorId != null, c => c.InstructorId == instructorId)
              .WhereIf(instructorId != 0 && instructorId != null &&
              filters.Type != null
              && filters.Type.ToLower() == CourseFiltersType.NotTaught.ToString().ToLower(), c => c.InstructorId != instructorId)
              .WhereIf(filters.StudentId != null &&
                filters.Type == null, c => c.Enrollments.Any(e => e.StudentId == studentId))
              .WhereIf(
                filters.StudentId != null &&
                filters.Type != null &&
                filters.Type.ToLower() == CourseFiltersType.NonEnroll.ToString().ToLower(),
                c => !c.Enrollments.Any(e => e.StudentId == studentId))
              .WhereIf(filters.CourseId.HasValue, c => c.Id == filters.CourseId)
              .WhereIf(filters.PackageId.HasValue, c => c.CoursesPackages.Any(cp => cp.PackageId == filters.PackageId))
              .WhereIf(filters.CategoryId.HasValue, c => c.CoursesCategories.Any(cc => cc.CategoryId == filters.CategoryId))
              .WhereIf(filters.UniversityId.HasValue, c => c.CoursesUnviersites.Any(cu => cu.UniversityId == filters.UniversityId));


            var filteredQuery = query.Select(c => new GetAllCourses
            {
                Id = c.Id,
                Name = c.Name,
                Description = c.Description,
                InstructorId = c.InstructorId,
                InstructorName = c.InstructorName,
                Price = c.Price,
                DiscountPrice = c.DiscountPrice,
                Image = c.Image,
                ChaptersCount = c.ChaptersCount,
                LessonsCount = _context.Lessons.Count(lesson => lesson.Chapter.CourseId == c.Id),
                EnrollmentsCount = c.StudentsCount,
                Universities = c.CoursesUnviersites.Select(cu => cu.University.Name).ToList(),
            }).AsQueryable();

            var paginationResult = await PaginationHelper.PaginateAsync(filteredQuery, filters.PageNumber, filters.PageSize);

            return paginationResult;
        }
        private Expression<Func<FilterCourse, object>> GetOrderByExpression(string sortBy)
        {

            switch (sortBy.ToLower())
            {
                case "name":
                    return c => c.Name;

                case "id":
                    return c => c.Id;

                case "enrollments":
                    return c => c.Enrollments.Count();

                case "price":
                    return c => c.DiscountPrice > 0 ? c.DiscountPrice : c.Price;

                default:
                    return null; // Default sorting behavior
            }
        }
        private async Task<string> GetUserType(string UserId)
        {

            var role = await _context.UsersRoles
                   .Where(ur => ur.UserId == UserId)
                   .Select(ur => ur.Role.Name)
                   .FirstOrDefaultAsync();

            return role;
        }
        private async Task<int> GetStudentIdByUserID(string UserId)
        {
            var studentId = await _context.Students
                .Where(s => s.UserId == UserId)
                .Select(s => s.Id)
                .FirstOrDefaultAsync();

            return studentId;
        }
        private async Task<int> GetInstructorIdByUserID(string UserId)
        {
            var instructorId = await _context.Instructors
                .Where(s => s.UserId == UserId)
                .Select(s => s.Id)
                .FirstOrDefaultAsync();

            return instructorId;
        }
        private async Task<bool> IsEnroll(int CourseId, int StudentId)
        {
            var isEnroll = await _context.Enrollments.AnyAsync(e => e.CourseId == CourseId && e.StudentId == StudentId);

            return isEnroll;
        }
        private async Task<List<string>> GetCourseUnviersties(int courseId)
        {
            var courseUniversities = await _context.CoursesUnviersites
                      .Where(cu => cu.CourseId == courseId)
                      .Select(cu => cu.University.Name).ToListAsync();

            return courseUniversities;
        }
        private async Task<List<string>> GetCourseCategoris(int courseId)
        {
            var courseCategories = await _context.CoursesCategories
                      .Where(cu => cu.CourseId == courseId)
                      .Select(cu => cu.Category.Name).ToListAsync();

            return courseCategories;
        }
        private GetCourse CreateGetCourseResponse(Course course, List<string>? courseUnviersties, List<string>? courseCategories, bool isEnroll = false, bool editable = false, bool isPending = false, bool isInCart = false)
        {
            return new GetCourse
            {
                Id = course.Id,
                Name = course.Name,
                Description = course.Description,
                Image = course.Image,
                LessonsCount = _context.Lessons.Count(lesson => lesson.Chapter.CourseId == course.Id),
                Price = course.Price,
                DiscountPrice = course.DiscountPrice,
                DirectPrice = course.DirectPrice,
                IsEnroll = isEnroll,
                EditAble = editable,
                IsPending = isPending,
                IsInCart = isInCart,
                Universities = courseUnviersties,
                Categories = courseCategories,
                EnrollmentsCount = course.Enrollments.Count,
                ImageOverView = !string.IsNullOrEmpty(course.OverViewImage) ? course.OverViewImage : DefaultImagePath.CourseCoverImage,
                VideoOverView = course.VideoOverView,
                InstructorId = course.InstructorId.GetValueOrDefault(),
                InstructorName = course.InstructorId.HasValue ? $"{course.Instructor!.User.FirstName} {course.Instructor.User.LastName}" : null,
                InstructorImage = course.InstructorId.HasValue ? course.Instructor.User.ProfileImage : null,
                Key = ResponseKeys.Success.ToString(),
            };
        }
        private async Task<bool> IsCoursePending(int courseId, string userId)
        {
            var isPending = await _context.OrderItems
                .Include(oi => oi.UserOrder)
                .AnyAsync(oi => oi.ItemId == courseId
                && oi.Type == ItemTypes.Course
                && oi.UserOrder.UserId == userId
                && !oi.UserOrder.IsConfirmed
                );
            return isPending;
        }
        private async Task<bool> IsCourseInCart(int courseId, string userId)
        {
            var inCart = await _context.UserCart
                .AnyAsync(uc => uc.UserId == userId
                && uc.ItemId == courseId
                && uc.Type == ItemTypes.Course
                );
            return inCart;
        }
    }
}
