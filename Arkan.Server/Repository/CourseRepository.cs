using Arkan.Server.BaseRepository;
using Arkan.Server.Data;
using Arkan.Server.Enums;
using Arkan.Server.Helpers;
using Arkan.Server.ImagesHelper;
using Arkan.Server.Interfaces;
using Arkan.Server.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Drawing.Printing;
using System.Linq.Expressions;
using Arkan.Server.PageModels.CourseModels;
using Arkan.Server.LoggerFilter;

namespace Arkan.Server.Repository
{
    public class CourseRepository : ICourseInterface
    {
        private readonly ApplicationDBContext _context;
        private readonly IBaseRepository _IBaseRepository;
        private readonly ImageHelperInterface _ImageHelper;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ILoggerService _ILoggerService;

        public CourseRepository(ApplicationDBContext context, UserManager<ApplicationUser> userManager,
            IBaseRepository IBaseRepository
            , IWebHostEnvironment webHostEnvironment
            , ImageHelperInterface ImageHelper
            , ILoggerService logService)
        {
            _context = context;
            _IBaseRepository = IBaseRepository;
            _ImageHelper = ImageHelper;
            _userManager = userManager;
            _ILoggerService = logService;
        }
        public async Task<GetCourseInfo> AddCourseAsync(AddCourseModel model,string userId)
        {
            if (string.IsNullOrWhiteSpace(model.Name))
            {
                return new GetCourseInfo { Key = ResponseKeys.InvalidInput.ToString() };
            }

            var isCourseNameExists = await _context.Courses.AnyAsync(course => course.Name == model.Name);

            if (isCourseNameExists)
            {
                return new GetCourseInfo { Key = ResponseKeys.NameExists.ToString() };
            }

            var InstructorName="";

            var instructorId = 0;

            if (model.InstructorId is not null)
            {
                var instructor = await GetInstructortByUserID(model.InstructorId);

                 if (instructor is null)
                 {
                     return new GetCourseInfo { Key = ResponseKeys.InstructorNotFound.ToString() };
                 }

                var user = await _userManager.FindByIdAsync(instructor.UserId);
                instructorId = instructor.Id;
                InstructorName = $"{user.FirstName} {user.LastName}";

            }

            var price = model.Price;
            var discountPrice = model.DiscountPrice;

            if(discountPrice >= price)
            {
                return new GetCourseInfo { Key = ResponseKeys.InvaildDiscountPrice.ToString() };
            }
            
            if (!Enum.IsDefined(typeof(CourseStatus), model.Status))
            {
                return new GetCourseInfo { Key = ResponseKeys.InvalidStatus.ToString() };
            }

            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    var course = new Course
                    {
                        //Title = model.Title,
                        Name = model.Name.Trim(),
                        Description = model.Description.Trim(),
                        StartDate = _IBaseRepository.GetJordanTime(),
                        EnrollmentLimit = model.EnrollmentLimit ?? 0,
                        InstructorId = instructorId,
                        Price = model.Price,
                        DiscountPrice = model.DiscountPrice ?? 0,
                        Status = model.Status,
                        VideoOverView = model.OverViewUrl,
                        CreatedAt = _IBaseRepository.GetJordanTime(),
                        CreatedBy = userId
                    };

                    if (model.Image != null)
                    {
                        var imageTask = _ImageHelper.AddImage(model.Image, ImagesFiles.courses.ToString());
                        course.Image = await imageTask;
                    }

                    if (model.CoverImage != null)
                    {
                        var imageTask =  _ImageHelper.AddImage(model.CoverImage, ImagesFiles.coursesCoverImage.ToString());

                        course.OverViewImage = await imageTask;
                    }

                    await _IBaseRepository.AddAsync(course);

                    if (model.CategoryIds != null && model.CategoryIds.Any())
                    {
                        foreach (var categoryId in model.CategoryIds)
                        {
                            var isCategoryExists = await _IBaseRepository.AnyByIdAsync<Category>(categoryId);
                            if (!isCategoryExists)
                            {
                                return new GetCourseInfo
                                {
                                    Key = ResponseKeys.CategoryNotFound.ToString()
                                };
                            }

                            var coursesCategory = new CoursesCategories
                            {
                                CourseId = course.Id,
                                CategoryId = categoryId
                            };
                        
                            await _IBaseRepository.AddAsync(coursesCategory);
                        }
                    }

                    if (model.UniversitiesIds != null && model.UniversitiesIds.Any())
                    {
                        var universitiesToAdd = model.UniversitiesIds.Select(universityId => new CoursesUnviersites
                        {
                            UniversityId = universityId,
                            CourseId = course.Id
                        }).ToList();

                        await _IBaseRepository.AddRangeAsync(universitiesToAdd);
                    }

                    var addedCourse = await _context.Courses
                        .Where(c => c.Id == course.Id)
                        .Include(c=>c.CoursesCategories)
                        .ThenInclude(c=>c.Category)
                        .SingleOrDefaultAsync();

                    var courseCategories = addedCourse.CoursesCategories.Select(CourseCategory => new CourseCategories
                    {
                        Id = CourseCategory.CategoryId,
                        Name = CourseCategory.Category.Name
                    }).ToList();

                    var courseUniversities = await _context.CoursesUnviersites
                        .Where(cu=>cu.CourseId==course.Id)
                        .Select(cu => new CourseUniversities
                        {
                            Id = cu.UniversityId,
                            Name = cu.University.Name
                        }).ToListAsync();


                    var courseRoom = new CoursesChatRooms
                    {
                        CourseId = course.Id,
                    };


                   await _ILoggerService.AddLog(userId,ActionTypes.Add.ToString(),ItemsType.Course.ToString(), addedCourse.Name);

                    await _IBaseRepository.AddAsync<CoursesChatRooms>(courseRoom);

                    await _context.SaveChangesAsync();
                    await transaction.CommitAsync();


                    return new GetCourseInfo
                    {
                        Id = course.Id,
                        Name = course.Name,
                        Description = course.Description,
                        Price = course.Price,
                        DiscountPrice = course.DiscountPrice,
                        Status = course.Status,
                        StudentsCount = 0,
                        InstructorName = InstructorName,
                        InstructorId = course.Instructor != null ? course.Instructor.UserId : null,
                        EnrollmentLimit = course.EnrollmentLimit,
                        Categories = courseCategories,
                        Image = course.Image,
                        OverViewUrl = course.VideoOverView,
                        CoverImage = course.OverViewImage,
                        Universities = courseUniversities,
                        Key = ResponseKeys.Success.ToString(),
                    };
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    return new GetCourseInfo { Key = ResponseKeys.Failed.ToString() };
                }

            }
        }
        public async Task<GetCourseInfo> UpdateCourseAsync(UpdateCourseModel model,string userId)
        {
            if (string.IsNullOrWhiteSpace(model.Name))
            {
                return new GetCourseInfo { Key = ResponseKeys.InvalidInput.ToString() };
            }

            var isCourseNameExists = await _context.Courses.AnyAsync(course => course.Name == model.Name && course.Id != model.Id);
            if (isCourseNameExists)
            {
                return new GetCourseInfo { Key = ResponseKeys.NameExists.ToString() };
            }

            if (!Enum.IsDefined(typeof(CourseStatus), model.Status))
            {
                return new GetCourseInfo { Key = ResponseKeys.InvalidStatus.ToString() };
            }
            var InstructorName = "";
            var instructorId = 0;
            if (model.InstructorId is not null)
            {
                var instructor = await GetInstructortByUserID(model.InstructorId);

                if (instructor is null)
                {
                    return new GetCourseInfo { Key = ResponseKeys.InstructorNotFound.ToString() };
                }

                var user = await _userManager.FindByIdAsync(instructor.UserId);
                instructorId = instructor.Id;
                InstructorName = $"{user.FirstName} {user.LastName}";
            }

            var price = model.Price;
            var discountPrice = model.DiscountPrice;

            if (discountPrice >= price)
            {
                return new GetCourseInfo { Key = ResponseKeys.InvaildDiscountPrice.ToString() };
            }
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var course = await _context.Courses.Where(course => course.Id == model.Id).FirstOrDefaultAsync();


                if (model.Image != null && !(model.Image is string))
                {
                    if (!string.IsNullOrEmpty(course.Image))
                    {
                        await _ImageHelper.DeleteImage(course.Image);
                    }

                    course.Image = await _ImageHelper.AddImage(model.Image, ImagesFiles.courses.ToString());
                }

                if (model.CoverImage != null && !(model.CoverImage is string))
                {
                    var imageTask = _ImageHelper.AddImage(model.CoverImage, ImagesFiles.coursesCoverImage.ToString());

                    course.OverViewImage = await imageTask;
                }

                course.Name = model.Name.Trim();
                course.Description = model.Description.Trim();
                course.InstructorId = instructorId;
                course.Price = model.Price;
                course.DiscountPrice = model.DiscountPrice ?? 0;
                course.Status = model.Status;
                course.VideoOverView = model.OverViewUrl;
                course.ModifiedAt = _IBaseRepository.GetJordanTime();
                course.ModifiedBy = userId;

                _IBaseRepository.Update(course);

                if (model.CategoryIds != null && model.CategoryIds.Any())
                {

                    var existingCourseCategories = await _context.CoursesCategories
                    .Where(coursesCategories => coursesCategories.CourseId == course.Id)
                    .ToListAsync();

                    _IBaseRepository.RemoveRange<CoursesCategories>(existingCourseCategories);

                    var categoriesToAdd = model.CategoryIds.Select(categoryId => new CoursesCategories
                    {
                        CourseId = course.Id,
                        CategoryId = categoryId
                    }).ToList();

                    await _IBaseRepository.AddRangeAsync<CoursesCategories>(categoriesToAdd);
                }

                if (model.UniversitiesIds != null && model.UniversitiesIds.Any())
                {

                    var existingUniversities = await _context.CoursesUnviersites
                    .Where(cu => cu.CourseId == course.Id)
                    .ToListAsync();

                    _IBaseRepository.RemoveRange<CoursesUnviersites>(existingUniversities);

                    var universitiesToAdd =  model.UniversitiesIds.Select(universityId => new CoursesUnviersites
                    {
                        UniversityId = universityId,
                        CourseId = course.Id
                    }).ToList();
                    await _IBaseRepository.AddRangeAsync<CoursesUnviersites>(universitiesToAdd);
                }

                var enrollmentsCount = await _context.Enrollments.Where(enroll=>enroll.CourseId == course.Id).CountAsync();
                var courseCategories = await _context.CoursesCategories
                    .Where(courseCategory => courseCategory.CourseId == course.Id)
                    .Select(coursesCategories => new CourseCategories
                     {
                         Id = coursesCategories.CategoryId,
                         Name = coursesCategories.Category.Name,
                     }
                     ).ToListAsync();

                var courseUniversities = await _context.Unviersites
                      .Where(u => model.UniversitiesIds.Contains(u.Id))
                      .Select(cu => new CourseUniversities
                      {
                          Id = cu.Id,
                          Name = cu.Name
                      }).ToListAsync();


                await _ILoggerService.AddLog(userId, ActionTypes.Update.ToString(), ItemsType.Course.ToString(), course.Name);

                await _context.SaveChangesAsync();

                await transaction.CommitAsync();

                return new GetCourseInfo
                {
                    Id = course.Id,
                    Name = course.Name,
                    Description = course.Description,
                    Price = course.Price,
                    DiscountPrice = course.DiscountPrice,
                    Status = course.Status,
                    StudentsCount = enrollmentsCount,
                    InstructorName = InstructorName,
                    InstructorId = course.Instructor != null ? course.Instructor.UserId : null,
                    Categories = courseCategories,
                    Image = course.Image,
                    OverViewUrl = course.VideoOverView,
                    Universities = courseUniversities,
                    CoverImage = course.OverViewImage,
                    Key = ResponseKeys.Success.ToString(),
                };
             
            }
            catch (Exception ex)
            {
                // Rollback the transaction if an exception occurs
                await transaction.RollbackAsync();
                return new GetCourseInfo { Key = ResponseKeys.Failed.ToString() };
            }
        }
        public async Task<string> RemoveCourseAsync(int CourseId,string userId)
        {
            var course = await _IBaseRepository.FindByIdAsync<Course>(CourseId);

            if (course is null)
            {
                return ResponseKeys.CourseNotFound.ToString();
            }

            await _ILoggerService.AddLog(userId, ActionTypes.Add.ToString(), ItemsType.Course.ToString(), course.Name);

            _IBaseRepository.Remove(course);

            if (!string.IsNullOrEmpty(course.Image))
            {
                await _ImageHelper.DeleteImage(course.Image);
            }
            if (!string.IsNullOrEmpty(course.OverViewImage))
            {
                await _ImageHelper.DeleteImage(course.OverViewImage);
            }

            return ResponseKeys.Success.ToString();
        }
        public async Task<PaginationResult<GetEnrolledStudents>> GetEnrolledStudents(int pageNumber, int pageSize,int CourseId)
        {
            var course = await _context.Courses.FirstOrDefaultAsync(Course => Course.Id == CourseId);
       
            var query = _context.Enrollments
                                          .Where(enrollment => enrollment.CourseId == CourseId)
                                          .Include(enrollment => enrollment.Student.User)
                                          .Select(enrollment => new GetEnrolledStudents
                                          {
                                              Id = enrollment.StudentId,
                                              Email = enrollment.Student.User.Email,
                                              Sex = enrollment.Student.Sex,
                                              Name = $"{enrollment.Student.User.FirstName} {enrollment.Student.User.LastName}",
                                              PhoneNumber = enrollment.Student.User.PhoneNumber,
                                              EnrollDate = enrollment.EnrollmentDate,
                                              University = enrollment.Student.University,
                                          })
                                          .AsQueryable();

            var paginationResult = await PaginationHelper.PaginateAsync(query, pageNumber, pageSize);

            return paginationResult;
        }
        public async Task<string> RemoveStudentsFromCourse(RemoveCourseStudentsDto model)
        {
            var isCourseExists = await _IBaseRepository.AnyByIdAsync<Course>(model.CourseId);

            if (!isCourseExists)
            {
                return ResponseKeys.CourseNotFound.ToString();
            }

            //var studentsIds = new List<int>(); 

            //foreach(var item in model.UserIds)
            //{
            //    var student = await GetStudentByUserID(item);

            //    if (student == null)
            //    {
            //        return ResponseKeys.UserNotFound.ToString();
            //    }
            //    studentsIds.Add(student.Id);
            //}

            var studentIds = model.UserIds; 
            var students = await _context.Students.Where(s => studentIds.Contains(s.UserId)).Select(s=>s.Id).ToListAsync();

            if (students.Count != studentIds.Count)
            {
                return ResponseKeys.UserNotFound.ToString();
            }
         
            var enrollments = await _context.Enrollments
            .Where(enroll => students.Contains(enroll.StudentId) && enroll.CourseId == model.CourseId)
            .ToListAsync();

            _IBaseRepository.RemoveRange(enrollments);

            return ResponseKeys.Success.ToString();
        }
        public async Task<PaginationResult<GetCoursesMainInfo>> GetPaginatedEntitiesAsync(int pageNumber, int pageSize)
        {
            var query = _context.Courses
                .OrderByDescending(c => c.CreatedAt)
             .Select(course=> new GetCoursesMainInfo
             {
                 Id = course.Id,
                 Image = course.Image,
                 Name = course.Name,
                 Price = course.Price,
                 Description = course.Description,
                 DiscountPrice = course.DiscountPrice,
                 StudentsCount = course.Enrollments.Count,
                 InstructorName = course.InstructorId.HasValue
                ? $"{course.Instructor!.User.FirstName} {course.Instructor.User.LastName}"
                : null,
                 Status = course.Status.ToString(),
            }).AsQueryable();
            var paginationResult = await PaginationHelper.PaginateAsync(query, pageNumber, pageSize);
            return paginationResult;
        }
        public async Task<PaginationResult<GetCoursesMainInfo>> FilterCoursesByName(int pageNumber, int pageSize,string Name)
        {
            var query = _context.Courses
             .OrderByDescending(c => c.CreatedAt)
             .Select(course => new GetCoursesMainInfo
             {
                 Id = course.Id,
                 Name = course.Name,
                 Price = course.Price,
                 DiscountPrice = course.DiscountPrice,
                 StudentsCount = course.Enrollments.Count,
                 InstructorName = course.InstructorId.HasValue
                ? $"{course.Instructor!.User.FirstName} {course.Instructor.User.LastName}"
                : null,
                 Status = course.Status.ToString(),
             }).AsQueryable();

            var paginationResult = await PaginationHelper.PaginateAsync<GetCoursesMainInfo, object>(query, pageNumber, pageSize,
             filter: x => x.Name.ToLower().Contains(Name.ToLower().Trim()));

            return paginationResult;
        }
        public async Task<GetCourseInfo> GetCourseById(int courseId)
        {
            var isCourseExists = await _context.Courses.AnyAsync(course=>course.Id == courseId);

            if(!isCourseExists)
            {
                return new GetCourseInfo { Key = ResponseKeys.CourseNotFound.ToString()};
            }

            var existingCourseCategories = await _context.CoursesCategories
                   .Where(coursesCategories => coursesCategories.CourseId == courseId)
                   .Select(coursesCategories => new CourseCategories
                   {
                       Id = coursesCategories.CategoryId,
                       Name = coursesCategories.Category.Name,
                   }
                   ).ToListAsync();

            var courseUniversities = await _context.CoursesUnviersites
                       .Where(cu => cu.CourseId == courseId)
                       .Select(cu => new CourseUniversities
                       {
                           Id = cu.UniversityId,
                           Name = cu.University.Name
                       }).ToListAsync();

            var course = await _context.Courses
                .Where(course => course.Id == courseId)
                .Select(course => new GetCourseInfo
                {
                    Id = course.Id,
                    Name = course.Name,
                    Price = course.Price,
                    Description = course.Description,
                    DiscountPrice = course.DiscountPrice ?? 0,
                    Status = course.Status,
                    StudentsCount = course.Enrollments.Count,
                    InstructorName = course.InstructorId != null ? course.Instructor.User.FirstName + " " + course.Instructor.User.LastName : null,
                    InstructorId = course.Instructor != null ? course.Instructor.UserId : null,
                    Image = course.Image,
                    EnrollmentLimit = course.EnrollmentLimit ?? 0,
                    Categories = existingCourseCategories,
                    Universities = courseUniversities,
                    OverViewUrl = course.VideoOverView,
                    CoverImage = course.OverViewImage,
                    Key = ResponseKeys.Success.ToString()
                })
                .FirstOrDefaultAsync();

            return course;

        }
        public async Task<PaginationResult<GetFilteredCourses>> FilterCourses(CourseFilterModel filters)
        {
            var query = _context.Courses.Select(course => new FilterCourse
            {
                Id = course.Id,
                Image = course.Image,
                Name = course.Name,
                Price = course.Price,
                InstructorId = course.InstructorId ?? 0,
                Enrollments = course.Enrollments,
                StudentsCount = course.Enrollments.Count,
                InstructorName = course.InstructorId != null ? course.Instructor.User.FirstName + " " + course.Instructor.User.LastName : null,
                DiscountPrice = course.DiscountPrice,
                OffLinePrice = course.DirectPrice,
                Description = course.Description,
                CoursesPackages = course.CoursesPackages,
                CoursesUnviersites = course.CoursesUnviersites,
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

            var instructorId = filters.InstructorId != null ? await GetInstructorIdByUserID(filters.InstructorId) : 0;


            query = query.WhereIf(!string.IsNullOrEmpty(filters.CourseName), c => c.Name.ToLower().Contains(filters.CourseName.ToLower()))
              .WhereIf(filters.InstructorId != null, c => c.InstructorId == instructorId)
              .WhereIf(filters.InstructorId != null &&
              filters.Type != null
              && filters.Type.ToLower() == CourseFiltersType.NotTaught.ToString().ToLower(), c => c.InstructorId != instructorId)
              .WhereIf(filters.StudentId != null &&
                filters.Type == null , c => c.Enrollments.Any(e => e.StudentId == studentId))
              .WhereIf(
                filters.StudentId != null &&
                filters.Type != null &&
                filters.Type.ToLower() == CourseFiltersType.NonEnroll.ToString().ToLower(),
                c => !c.Enrollments.Any(e => e.StudentId == studentId))
              .WhereIf(filters.CourseId.HasValue, c => c.Id == filters.CourseId)
              .WhereIf(filters.PackageId.HasValue, c => c.CoursesPackages.Any(cp=>cp.PackageId == filters.PackageId))
              .WhereIf(filters.CategoryId.HasValue, c=> c.CoursesCategories.Any(cc =>  cc.CategoryId == filters.CategoryId))
              .WhereIf(filters.UniversityId.HasValue, c => c.CoursesUnviersites.Any(cu => cu.UniversityId == filters.UniversityId));



            var filteredQuery = query.Select(course => new GetFilteredCourses
            {
                Id = course.Id,
                Image = course.Image,
                Name = course.Name,
                Price = course.Price,
                InstructorId = course.InstructorId ?? 0,
                StudentsCount = course.Enrollments.Count,
                InstructorName = course.InstructorName,
                DiscountPrice = course.DiscountPrice,
                OffLinePrice = course.OffLinePrice,
                Description = course.Description,
                Status = course.Status.ToString()

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
        private async Task<int> GetInstructorIdByUserID(string? userId)
        {
            var instructorId = await _context.Instructors
                                       .Where(s => s.UserId == userId)
                                       .Select(s => s.Id)
                                       .FirstOrDefaultAsync();
            return instructorId;
        }
        private async Task<Instructor> GetInstructortByUserID(string? userId)
        {
            var instructor = await _context.Instructors.FirstOrDefaultAsync(s => s.UserId == userId);
            return instructor;

        }
        private async Task<int> GetStudentIdByUserID(string userId)
        {
            var studentId = await _context.Students
                                          .Where(s => s.UserId == userId)
                                          .Select(s => s.Id)
                                          .FirstOrDefaultAsync();
            return studentId;
        }
    }
}