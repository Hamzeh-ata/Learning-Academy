using Arkan.Server.BaseRepository;
using Arkan.Server.Client_Interfaces;
using Arkan.Server.Client_PageModels.Packages;
using Arkan.Server.Data;
using Arkan.Server.Enums;
using Arkan.Server.Helpers;
using Arkan.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace Arkan.Server.Client_Repositories
{
    public class ClientPackagesRepository : IClientPackages
    {
        private readonly ApplicationDBContext _context;
        private readonly IBaseRepository _IBaseRepository;
        public ClientPackagesRepository(ApplicationDBContext context, IBaseRepository IBaseRepository)
        {
            _context = context;
            _IBaseRepository = IBaseRepository;
        }
        public async Task<PaginationResult<GetPackages>> GetPackages(int pageNumber, int pageSize, string? name)
        {
            var query = _context.Package
                .WhereIf(name != null, p => p.Name.ToLower().Contains(name.ToLower()))
            .Select(p => new GetPackages
            {
                Id = p.Id,
                Image = p.Image,
                Name = p.Name,
                Description = p.Description,
                Price = p.Price,
                DiscountPrice = p.DiscountPrice,
                CoursesCount = p.CoursesPackages.Count,
                LessonsCount = p.CoursesPackages
               .SelectMany(cp => cp.Course.Chapters)
               .SelectMany(c => c.Lessons)
               .Count(),
                Instructors = p.CoursesPackages
                .Select(cp => cp.Course.InstructorId)
                .Distinct()
                .Select(instructorId => _context.Instructors
                    .Where(i => i.Id == instructorId)
                    .Select(i => i.User.FirstName + " " + i.User.LastName)
                    .FirstOrDefault())
                .ToList()


            })
            .AsQueryable();

            var paginationResult = await PaginationHelper.PaginateAsync(query, pageNumber, pageSize);

            return paginationResult;
        }
        public async Task<GetPackage> GetPackage(int packageId, string? userId)
        {

            var isPackageExists = await _IBaseRepository.AnyByIdAsync<Package>(packageId);

            if (!isPackageExists)
            {
                return new GetPackage
                {
                    Key = ResponseKeys.NotFound.ToString()
                };
            }

            bool isInCart = false;
            bool isPending = false;
            bool isEnrolled = false;

            if (userId is not null)
            {
                isEnrolled = await IsPackageEnrolled(packageId, userId);

                if (!isEnrolled)
                {
                    isInCart = await IsPackageInCart(packageId, userId);

                    if (!isInCart)
                    {

                        isPending = await IsPackageIsPending(packageId, userId);

                    }
                }
            }

            var package = await _context.Package
            .Where(p => p.Id == packageId)
            .Select(p => new GetPackage
            {
                Id = p.Id,
                Name = p.Name,
                Image = p.Image,
                Description = p.Description,
                CoursesCount = p.CoursesPackages.Count,
                LessonsCount = p.CoursesPackages
                    .SelectMany(cp => cp.Course.Chapters)
                    .SelectMany(c => c.Lessons)
                    .Count(),
                Courses = p.CoursesPackages
                    .Select(cp => new GetPackageCourses
                    {
                        Id = cp.Course.Id,
                        Name = cp.Course.Name,
                        Image = cp.Course.Image,
                        Instructor = cp.Course.Instructor.User.FirstName + " " + cp.Course.Instructor.User.LastName,
                        Universities = cp.Course.CoursesUnviersites.Select(cu => cu.University.Name).ToList(),
                    })
                    .ToList(),
                IsInCart = isInCart,
                IsEnrolled = isEnrolled,
                IsPending = isPending,
                Key = ResponseKeys.Success.ToString(),
            })
            .SingleOrDefaultAsync();

            return package;
        }
        private async Task<bool> IsPackageInCart(int packageId, string userId)
        {
            var isInCart = await _context.UserCart.AnyAsync(uc => uc.UserId == userId
            && uc.ItemId == packageId
            && uc.Type == Enums.ItemTypes.Package);
            return isInCart;
        }
        private async Task<bool> IsPackageEnrolled(int packageId, string userId)
        {
            var studentId = await _IBaseRepository.GetStudentIdByUserId(userId);

            var packageCourses = await _context.CoursesPackages
                .Where(cp => cp.PackageId == packageId)
                .Select(cp => cp.CourseId)
                .ToListAsync();

            var studentEnrollments = await _context.Enrollments
                .Where(e => e.StudentId == studentId)
                .Select(e => e.CourseId)
                .ToListAsync();

            return packageCourses.All(pc => studentEnrollments.Contains(pc));

        }
        private async Task<bool> IsPackageIsPending(int packageId, string userId)
        {
            var isPending = await _context.OrderItems
                .Include(oi => oi.UserOrder)
                .AnyAsync(oi => oi.ItemId == packageId
                && oi.Type == ItemTypes.Package
                && oi.UserOrder.UserId == userId
                && !oi.UserOrder.IsConfirmed
                );
            return isPending;
        }
    }
}
