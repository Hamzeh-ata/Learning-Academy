using Arkan.Server.BaseRepository;
using Arkan.Server.Data;
using Arkan.Server.Enums;
using Arkan.Server.Helpers;
using Arkan.Server.ImagesHelper;
using Arkan.Server.Interfaces;
using Arkan.Server.Models;
using Arkan.Server.PageModels.CourseModels;
using Arkan.Server.PageModels.PackageModels;
using Microsoft.EntityFrameworkCore;

namespace Arkan.Server.Repository
{
    public class PackageRepository : IPackageInterface
    {
        private readonly ApplicationDBContext _context;
        private readonly IBaseRepository _IBaseRepository;
        private readonly ImageHelperInterface _ImageHelper;
        public PackageRepository(ApplicationDBContext context, IBaseRepository IBaseRepository, ImageHelperInterface ImageHelper)
        {
            _context = context;
            _IBaseRepository = IBaseRepository;
            _ImageHelper = ImageHelper;
        }

        public async Task<GetAddedPackage> AddPackage(AddPackageDto model, string userId)
        {
            var nameExists = await _context.Package.AnyAsync(Package => Package.Name == model.Name);

            if (nameExists)
            {
                return new GetAddedPackage { Key = ResponseKeys.NameExists.ToString() };
            }

            if (model.DiscountPrice >= model.Price)
            {
                return new GetAddedPackage { Key = ResponseKeys.InvaildDiscountPrice.ToString() };
            }
            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    var package = new Package
                    {
                        Name = model.Name.Trim(),
                        Price = model.Price,
                        DiscountPrice = model.DiscountPrice,
                        Description = model.Description.Trim(),
                        CreatedAt = _IBaseRepository.GetJordanTime(),
                        CreatedBy = userId
                    };

                    if (model.Image != null)
                    {
                        var imageTask = await _ImageHelper.AddImage(model.Image, ImagesFiles.packages.ToString());
                        package.Image = imageTask;
                    }

                    await _IBaseRepository.AddAsync(package);


                    if (model.CoursesIds != null && model.CoursesIds.Any())
                    {
                        var coursesToAdd = model.CoursesIds.Select(courseId => new CoursesPackages
                        {
                            CourseId = courseId,
                            PackageId = package.Id
                        }).ToList();

                        await _IBaseRepository.AddRangeAsync<CoursesPackages>(coursesToAdd);
                    }


                    var packageCourses = await _context.CoursesPackages
                        .Where(cp => cp.PackageId == package.Id)
                        .Include(cp => cp.Course)
                        .Select(CP => new GetCoursesMainInfo
                        {
                            Id = CP.Course.Id,
                            Image = CP.Course.Image,
                            Name = CP.Course.Name,
                            Price = CP.Course.Price,
                            DiscountPrice = CP.Course.DiscountPrice,
                            StudentsCount = CP.Course.Enrollments.Count,
                            InstructorName = CP.Course.InstructorId.HasValue
                       ? $"{CP.Course.Instructor!.User.FirstName} {CP.Course.Instructor.User.LastName}"
                       : null,
                            Status = CP.Course.Status.ToString(),
                            OffLinePrice = CP.Course.DirectPrice
                        }).ToListAsync();

                    await _context.SaveChangesAsync();
                    await transaction.CommitAsync();

                    return new GetAddedPackage
                    {
                        Id = package.Id,
                        Name = package.Name,
                        Description = package.Description,
                        Price = package.Price,
                        DiscountPrice = package.DiscountPrice,
                        Image = package.Image,
                        Courses = packageCourses,
                        CoursesCount = packageCourses.Count(),
                        Key = ResponseKeys.Success.ToString(),
                    };
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();

                    return new GetAddedPackage { Key = ResponseKeys.Failed.ToString() };
                }
            }
        }

        public async Task<GetUpdatedPackage> UpdatePackage(UpdatePackageDto model, string userId)
        {
            var nameExists = await _context.Package.AnyAsync(Package => Package.Name == model.Name && Package.Id != model.Id);

            if (nameExists)
            {
                return new GetUpdatedPackage { Key = ResponseKeys.NameExists.ToString() };
            }

            if (model.DiscountPrice >= model.Price)
            {
                return new GetUpdatedPackage { Key = ResponseKeys.InvaildDiscountPrice.ToString() };
            }
            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    var package = await _IBaseRepository.FindByIdAsync<Package>(model.Id);

                    if (package is null)
                    {

                        return new GetUpdatedPackage()
                        {
                            Key = ResponseKeys.PackageNotFound.ToString()
                        };

                    }

                    if (model.Image != null && !(model.Image is string))
                    {
                        if (!string.IsNullOrEmpty(package.Image))
                        {
                            await _ImageHelper.DeleteImage(package.Image);
                        }

                        package.Image = await _ImageHelper.AddImage(model.Image, ImagesFiles.packages.ToString());
                    }


                    package.Name = model.Name.Trim();
                    package.Description = model.Description.Trim();
                    package.Price = model.Price;
                    package.DiscountPrice = model.DiscountPrice;
                    package.ModifiedAt = _IBaseRepository.GetJordanTime();
                    package.ModifiedBy = userId;
                    _IBaseRepository.Update(package);

                    if (model.CoursesIds != null && model.CoursesIds.Any())
                    {
                        var existingPackages = await _context.CoursesPackages
                        .Where(cp => cp.PackageId == package.Id)
                        .ToListAsync();

                        _IBaseRepository.RemoveRange<CoursesPackages>(existingPackages);

                        var coursesToAdd = model.CoursesIds.Select(courseId => new CoursesPackages
                        {
                            CourseId = courseId,
                            PackageId = package.Id
                        }).ToList();

                        await _IBaseRepository.AddRangeAsync<CoursesPackages>(coursesToAdd);
                    }

                    var packageCourses = await _context.CoursesPackages
                       .Where(cp => cp.PackageId == package.Id)
                       .Include(cp => cp.Course)
                       .Select(CP => new GetCoursesMainInfo
                       {
                           Id = CP.Course.Id,
                           Image = CP.Course.Image,
                           Name = CP.Course.Name,
                           Price = CP.Course.Price,
                           DiscountPrice = CP.Course.DiscountPrice,
                           StudentsCount = CP.Course.Enrollments.Count,
                           InstructorName = CP.Course.InstructorId.HasValue
                      ? $"{CP.Course.Instructor!.User.FirstName} {CP.Course.Instructor.User.LastName}"
                      : null,
                           Status = CP.Course.Status.ToString(),
                           OffLinePrice = CP.Course.DirectPrice
                       }).ToListAsync();

                    await _context.SaveChangesAsync();
                    await transaction.CommitAsync();

                    return new GetUpdatedPackage
                    {
                        Id = package.Id,
                        Name = package.Name,
                        Description = package.Description,
                        Price = package.Price,
                        DiscountPrice = package.DiscountPrice,
                        Image = package.Image,
                        Courses = packageCourses,
                        CoursesCount = packageCourses.Count(),
                        Key = ResponseKeys.Success.ToString(),
                    };
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    return new GetUpdatedPackage { Key = ResponseKeys.Failed.ToString() };
                }
            }
        }

        public async Task<GetPackage> GetPackage(int packageId)
        {
            var packageExists = await _IBaseRepository.AnyByIdAsync<Package>(packageId);

            if (!packageExists)
            {
                return new GetPackage
                {
                    Key = ResponseKeys.PackageNotFound.ToString(),
                };
            }

            var package = await _IBaseRepository.FindByIdAsync<Package>(packageId);

            var packageCourses = await _context.CoursesPackages
                       .Where(cp => cp.PackageId == packageId)
                       .Include(cp => cp.Course)
                       .Select(CP => new GetCoursesMainInfo
                       {
                           Id = CP.Course.Id,
                           Image = CP.Course.Image,
                           Name = CP.Course.Name,
                           Price = CP.Course.Price,
                           DiscountPrice = CP.Course.DiscountPrice,
                           StudentsCount = CP.Course.Enrollments.Count,
                           InstructorName = CP.Course.InstructorId.HasValue
                      ? $"{CP.Course.Instructor!.User.FirstName} {CP.Course.Instructor.User.LastName}"
                      : null,
                           Status = CP.Course.Status.ToString(),
                           OffLinePrice = CP.Course.DirectPrice
                       }).ToListAsync();

            return new GetPackage
            {
                Id = package.Id,
                Name = package.Name,
                Description = package.Description,
                Price = package.Price,
                DiscountPrice = package.DiscountPrice,
                Image = package.Image,
                Courses = packageCourses,
                CoursesCount = packageCourses.Count(),
                Key = ResponseKeys.Success.ToString(),
            };

        }

        public async Task<PaginationResult<GetPackages>> GetPackages(int pageNumber, int pageSize)
        {
            var query = _context.Package
                .OrderByDescending(p => p.CreatedAt)
             .Select(package => new GetPackages
             {
                 Id = package.Id,
                 Image = package.Image,
                 Name = package.Name,
                 Description = package.Description,
                 Price = package.Price,
                 DiscountPrice = package.DiscountPrice,
                 CoursesCount = package.CoursesPackages.Count(),
             }).AsQueryable();
            var paginationResult = await PaginationHelper.PaginateAsync(query, pageNumber, pageSize);
            return paginationResult;
        }

        public async Task<string> RemovePackage(int packageId)
        {
            var packageExists = await _IBaseRepository.AnyByIdAsync<Package>(packageId);

            if (!packageExists)
            {
                return ResponseKeys.PackageNotFound.ToString();
            }

            var package = await _IBaseRepository.FindByIdAsync<Package>(packageId);

            _IBaseRepository.Remove(package);

            if (!string.IsNullOrEmpty(package.Image))
            {
                await _ImageHelper.DeleteImage(package.Image);
            }
            return ResponseKeys.Success.ToString();
        }
    }
}
