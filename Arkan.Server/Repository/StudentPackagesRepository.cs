using Arkan.Server.BaseRepository;
using Arkan.Server.Data;
using Arkan.Server.Enums;
using Arkan.Server.Helpers;
using Arkan.Server.ImagesHelper;
using Arkan.Server.Interfaces;
using Arkan.Server.Models;
using Arkan.Server.PageModels.PackageModels;
using Arkan.Server.StudentModels;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Arkan.Server.Repository
{
    public class StudentPackagesRepository : IStudentPackagesInterface
    {
        private readonly ApplicationDBContext _context;
        private readonly IBaseRepository _IBaseRepository;
        private readonly UserManager<ApplicationUser> _userManager;
        public StudentPackagesRepository(ApplicationDBContext context, UserManager<ApplicationUser> userManager, IBaseRepository IBaseRepository)
        {
            _context = context;
            _IBaseRepository = IBaseRepository;
            _userManager = userManager;
        }

        public async Task<PaginationResult<StudentPackagesModel>> GetStudentPackages(string userId,int pageNumber, int pageSize)
        {
            var user = await _userManager.FindByIdAsync(userId);

            if (user is null)
            {
                return new PaginationResult<StudentPackagesModel>();
            }

            var student = await GetStudentByUserID(userId);

            var query = _context.StudentsPackages
                .Where(sp => sp.StudentId==student.Id)
                .Include(sp=>sp.Package)
                .Select(sp => new StudentPackagesModel
                {
                    Id = sp.Package.Id,
                    Name = sp.Package.Image,
                    Image=sp.Package.Image,
                    Price=sp.Package.Price,
                    DiscountPrice = sp.Package.DiscountPrice,
                    Description = sp.Package.Description,
                }).AsQueryable();

            var paginationResult = await PaginationHelper.PaginateAsync(query, pageNumber, pageSize);
            return paginationResult;
        }

        public async Task<PaginationResult<StudentPackagesModel>> GetNonStudentPackages(string userId, int pageNumber, int pageSize)
        {
            var user = await _userManager.FindByIdAsync(userId);

            if (user is null)
            {
                return new PaginationResult<StudentPackagesModel>();
            }

            var student = await GetStudentByUserID(userId);

            var studentPackagesIds = await _context.StudentsPackages
                                  .Where(sp=>sp.StudentId==student.Id)
                                  .Select(sp=>sp.PackageId).ToListAsync();

            var query = _context.Package
                .Where(p=> !studentPackagesIds.Contains(p.Id))
                .Select(p => new StudentPackagesModel
                {
                    Id = p.Id,
                    Name = p.Image,
                    Image = p.Image,
                    Price = p.Price,
                    DiscountPrice = p.DiscountPrice,
                    Description = p.Description,
                }).AsQueryable();

            var paginationResult = await PaginationHelper.PaginateAsync(query, pageNumber, pageSize);
            return paginationResult;
        }

        public async Task<string> AddStudentPackages(AddStudentPackagesDto model)
        {
            var user = await _userManager.FindByIdAsync(model.UserId);

            if (user is null)
            {
                return ResponseKeys.UserNotFound.ToString();
            }

            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    var student = await GetStudentByUserID(model.UserId);

                    var existingPackages = await _context.StudentsPackages
                    .Where(sp => sp.StudentId == student.Id && model.PackagesId.Contains(sp.PackageId))
                    .Select(sp => sp.PackageId)
                    .ToListAsync();

                    var newPackages = model.PackagesId.Except(existingPackages);


                    var studentPackagesToAdd = newPackages.Select(packageId => new StudentsPackages
                    {
                        StudentId = student.Id,
                        PackageId = packageId
                    }).ToList();

                    await _IBaseRepository.AddRangeAsync<StudentsPackages>(studentPackagesToAdd);

                    var packageCourses = await _context.CoursesPackages
                    .Where(cp => newPackages.Contains(cp.PackageId))
                    .Select(cp => cp.CourseId)
                    .ToListAsync();

                    var studentCourses = await _context.Enrollments
                   .Where(e => e.StudentId == student.Id)
                   .Select(e => e.CourseId)
                   .ToListAsync();

                    var missingCourses = packageCourses.Except(studentCourses);

                    var enrollmentsToAdd = missingCourses.Select(courseId => new Enrollment
                    {
                        CourseId = courseId,
                        StudentId = student.Id,
                        EnrollmentDate = DateTime.Now
                    }).ToList();

                    await _IBaseRepository.AddRangeAsync<Enrollment>(enrollmentsToAdd);

                    await transaction.CommitAsync();

                    return ResponseKeys.Success.ToString();
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();

                    return ResponseKeys.Failed.ToString();
                }


            }
        }

        public async Task<string> RemoveStudentPackages(RemoveStudentPackagesDto model)
        {
            var user = await _userManager.FindByIdAsync(model.UserId);

            if (user is null)
            {
                return ResponseKeys.UserNotFound.ToString();
            }

            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    var student = await GetStudentByUserID(model.UserId);

                    var existingPackages = await _context.StudentsPackages
                    .Where(sp => sp.StudentId == student.Id && model.PackagesId.Contains(sp.PackageId))
                    .ToListAsync();

                     _IBaseRepository.RemoveRange<StudentsPackages>(existingPackages);


                    var coursesInPackages = await _context.CoursesPackages
                        .Where(cp => model.PackagesId.Contains(cp.PackageId))
                        .Select(cp => cp.CourseId)
                        .ToListAsync();

                    var enrollmentsToRemove = await _context.Enrollments
                        .Where(e => e.StudentId == student.Id && coursesInPackages.Contains(e.CourseId))
                        .ToListAsync();

                    _IBaseRepository.RemoveRange(enrollmentsToRemove);

                    await transaction.CommitAsync();

                    return ResponseKeys.Success.ToString();
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();

                    return ResponseKeys.Failed.ToString();
                }


            }
        }

        private async Task<Student> GetStudentByUserID(string userId)
        {
            var student = await _context.Students.FirstOrDefaultAsync(s => s.UserId == userId);

            return student;
        }


    }
}
