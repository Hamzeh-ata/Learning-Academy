using Arkan.Server.BaseRepository;
using Arkan.Server.Data;
using Arkan.Server.Enums;
using Arkan.Server.Helpers;
using Arkan.Server.ImagesHelper;
using Arkan.Server.Interfaces;
using Arkan.Server.Models;
using Arkan.Server.StudentModels;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Arkan.Server.PageModels.CourseModels;
using Arkan.Server.PageModels.InstructorModels;
namespace Arkan.Server.Repository
{
    public class InstructorRepository : IInstructorInterface
    {
        private readonly ApplicationDBContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IBaseRepository _IBaseRepository;
        private readonly ImageHelperInterface _ImageHelper;
        public InstructorRepository(ApplicationDBContext context, UserManager<ApplicationUser> userManager, IBaseRepository IBaseRepository, ImageHelperInterface ImageHelper)
        {
            _context = context;
            _userManager = userManager;
            _IBaseRepository = IBaseRepository;
            _ImageHelper = ImageHelper;
        }
        public async Task<PaginationResult<InstructorMainInfo>> GetAll(int pageNumber, int pageSize)
        {
            var query =  _context.Instructors
                .Include(i => i.User)
                .Select(i => new InstructorMainInfo
                {
                    Id = i.User.Id,
                    Email = i.User.Email,
                    phoneNumber = i.User.PhoneNumber,
                    InstructorCourses = i.Courses.Select(course => new CourseDto
                    {
                        Id = course.Id,
                        Name = course.Name,
                        Image = course.Image,
                        Status = course.Status.ToString(),
                        Description = course.Description,
                        StudentsCount = course.Enrollments.Count
                    }).ToList(),
                    CoursesCount = i.Courses.Count,
                    FirstName = i.User.FirstName,
                    LastName = i.User.LastName,
                    Image = i.User.ProfileImage
                }).AsQueryable();

            var paginationResult = await PaginationHelper.PaginateAsync(query, pageNumber, pageSize);

            return paginationResult;
        }
        public async Task<InstructorInformaition> GetInstructorInformationAsync(string UserId)
        {
            var User = await _userManager.FindByIdAsync(UserId);

            if( User is null)
            {
                return new InstructorInformaition { Key = ResponseKeys.UserNotFound.ToString() };
            }
      
            var Instructor = await _context.Instructors
            .Where(instructor => instructor.UserId == UserId)
            .Select(instructor => new
            {
                instructor.Bio,
                instructor.Specialization,
                instructor.LinkedIn,
                instructor.Twitter,
                instructor.Facebook,
                instructor.Instagram,
                instructor.Experience,
                instructor.OfficeHours,
                instructor.Location,
                instructor.Sex,
                instructor.showStudentsCount
            })
            .FirstOrDefaultAsync();

            return new InstructorInformaition
            {
                UserId = UserId,
                FirstName = User.FirstName,
                LastName = User.LastName,
                Image = User.ProfileImage,
                Email = User.Email,
                PhoneNumber = User.PhoneNumber,
                //BirthDate = Instructor.birthDate,
                Sex = Instructor.Sex,
                Bio = Instructor.Bio,
                Specialization = Instructor.Specialization,
                LinkedIn = Instructor.LinkedIn,
                Twitter = Instructor.Twitter,
                Facebook = Instructor.Facebook,
                Instagram = Instructor.Instagram,
                Experience = Instructor.Experience,
                OfficeHours = Instructor.OfficeHours,
                Location = Instructor.Location,
                ShowStudentsCount = Instructor.showStudentsCount,
                Key = ResponseKeys.Success.ToString(),
            };
        }
        public async Task<InstructorInformaition> AddInstructorInformationAsync(InstructorInformaitionDto model)
        {
            var user = await _userManager.FindByIdAsync(model.UserId);
            if (user is null)
            {
                return new InstructorInformaition { Key = ResponseKeys.UserNotFound.ToString() };
            }
            if (model.Email is null)
            {
                return new InstructorInformaition { Key = ResponseKeys.EmptyEmail.ToString() };
            }
            var userByEmail = await _userManager.FindByEmailAsync(model.Email);

            if (userByEmail != null && userByEmail.Id != user.Id)
            {
                return new InstructorInformaition { Key = ResponseKeys.EmailExists.ToString() };
            }
            if (model.FirstName is null)
            {
                return new InstructorInformaition { Key = ResponseKeys.EmptyFirstName.ToString() };
            }
            if (model.LastName is null)
            {
                return new InstructorInformaition { Key = ResponseKeys.EmptyLastName.ToString() };
            }
            if (model.PhoneNumber is null)
            {
                return new InstructorInformaition { Key = ResponseKeys.EmptyPhone.ToString() };
            }

            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    var Instructor = await _context.Instructors
                    .Where(instructor => instructor.UserId == user.Id)
                    .FirstOrDefaultAsync();

                    if (model.Image != null)
                    {
                        if (!string.IsNullOrEmpty(user.ProfileImage))
                        {
                            await _ImageHelper.DeleteImage(user.ProfileImage);
                        }

                        user.ProfileImage = await _ImageHelper.AddImage(model.Image, ImagesFiles.instructors.ToString());
                    }

                    user.FirstName = model.FirstName;
                    user.LastName = model.LastName;
                    user.Email = model.Email;
                    user.PhoneNumber = model.PhoneNumber;
                    user.UserName = model.Email;
                    //student.BirthDate = studentInformation.BirthDate;
                    Instructor.Sex = model.Sex;
                    Instructor.Bio = model.Bio;
                    Instructor.Location = model.Location;
                    Instructor.Facebook = model.Facebook;
                    Instructor.Twitter = model.Twitter;
                    Instructor.Instagram = model.Instagram;
                    Instructor.OfficeHours = model.OfficeHours;
                    Instructor.Specialization = model.Specialization;
                    Instructor.Experience=model.Experience;
                    Instructor.LinkedIn = model.LinkedIn;
                    Instructor.showStudentsCount = model.ShowStudentsCount;
                    user.NormalizedEmail = model.Email.ToUpper();
                    user.NormalizedUserName = model.Email.ToUpper();

                    var result = await _userManager.UpdateAsync(user);

                    if (!result.Succeeded)
                    {
                        return new InstructorInformaition { Key = ResponseKeys.Failed.ToString() };
                    }

                     _IBaseRepository.Update(Instructor);

                    await transaction.CommitAsync();

                    return new InstructorInformaition
                    {
                        UserId = user.Id,
                        FirstName = user.FirstName,
                        LastName = user.LastName,
                        Image = user.ProfileImage,
                        Email = user.Email,
                        PhoneNumber = user.PhoneNumber,
                        //BirthDate = studentInformation.BirthDate,
                        Sex = Instructor.Sex,
                        Bio = Instructor.Bio,
                        Location = Instructor.Location,
                        LinkedIn = Instructor.LinkedIn,
                        Facebook = Instructor.Facebook,
                        Twitter = Instructor.Twitter,
                        Instagram = Instructor.Instagram,
                        OfficeHours = Instructor.OfficeHours,
                        Specialization = Instructor.Specialization,
                        Experience = Instructor.Experience,
                        ShowStudentsCount = Instructor.showStudentsCount,
                        Key = ResponseKeys.Success.ToString()
                };

                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();

                    return new InstructorInformaition
                    {
                        Key = ResponseKeys.Failed.ToString()
                    };
                }
            }

        }
        public async Task<InstructorInformaition> UpdateInstructorInformationAsync(InstructorInformaitionDto model)
        {
            var user = await _userManager.FindByIdAsync(model.UserId);
            if (user is null)
            {
                return new InstructorInformaition { Key = ResponseKeys.UserNotFound.ToString() };
            }

            if (model.Email is null)
            {
                return new InstructorInformaition { Key = ResponseKeys.EmptyEmail.ToString() };
            }

            var userByEmail = await _userManager.FindByEmailAsync(model.Email);

            if (userByEmail != null && userByEmail.Id != user.Id)
            {
                return new InstructorInformaition { Key = ResponseKeys.EmailExists.ToString() };
            }

            if (model.FirstName is null)
            {
                return new InstructorInformaition { Key = ResponseKeys.EmptyFirstName.ToString() };
            }
            if (model.LastName is null)
            {
                return new InstructorInformaition { Key = ResponseKeys.EmptyLastName.ToString() };
            }
            if (model.PhoneNumber is null)
            {
                return new InstructorInformaition { Key = ResponseKeys.EmptyPhone.ToString() };
            }

            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {

                    var Instructor = await _context.Instructors
                    .Where(instructor => instructor.UserId == user.Id)
                    .FirstOrDefaultAsync();


                    if (model.Image != null && !(model.Image is string))
                    {
                        if (!string.IsNullOrEmpty(user.ProfileImage))
                        {
                            await _ImageHelper.DeleteImage(user.ProfileImage);
                        }

                        user.ProfileImage = await _ImageHelper.AddImage(model.Image, ImagesFiles.instructors.ToString());
                    }

                    user.FirstName = model.FirstName;
                    user.LastName = model.LastName;
                    user.Email = model.Email;
                    user.PhoneNumber = model.PhoneNumber;
                    user.UserName = model.Email;
                    //student.BirthDate = studentInformation.BirthDate;
                    Instructor.Sex = model.Sex;
                    Instructor.Bio = model.Bio;
                    Instructor.Location = model.Location;
                    Instructor.LinkedIn = model.LinkedIn;
                    Instructor.Facebook = model.Facebook;
                    Instructor.Twitter = model.Twitter;
                    Instructor.Instagram = model.Instagram;
                    Instructor.OfficeHours = model.OfficeHours?.Trim();
                    Instructor.Specialization = model.Specialization?.Trim();
                    Instructor.Experience = model.Experience?.Trim();
                    Instructor.showStudentsCount = model.ShowStudentsCount;
                    user.NormalizedEmail = model.Email.ToUpper();
                    user.NormalizedUserName = model.Email.ToUpper();

                    var result = await _userManager.UpdateAsync(user);

                    if (!result.Succeeded)
                    {
                        return new InstructorInformaition { Key = ResponseKeys.Failed.ToString() };
                    }

                    _IBaseRepository.Update(Instructor);

                    await transaction.CommitAsync();

                    return new InstructorInformaition
                    {
                        UserId=user.Id,
                        FirstName = user.FirstName,
                        LastName = user.LastName,
                        Email = user.Email,
                        PhoneNumber = user.PhoneNumber,
                        Image = user.ProfileImage,
                        //BirthDate = studentInformation.BirthDate,
                        Sex = Instructor.Sex,
                        Bio = Instructor.Bio,
                        Location = Instructor.Location,
                        Facebook = Instructor.Facebook,
                        LinkedIn = Instructor.LinkedIn,
                        Twitter = Instructor.Twitter,
                        Instagram = Instructor.Instagram,
                        OfficeHours = Instructor.OfficeHours,
                        Specialization = Instructor.Specialization,
                        Experience = Instructor.Experience,
                        ShowStudentsCount = Instructor.showStudentsCount,
                        Key = ResponseKeys.Success.ToString()
                    };

                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();

                    return new InstructorInformaition
                    {
                        Key = ResponseKeys.Failed.ToString()
                    };
                }
            }


        }
        public async Task<string> DeleteInstructor(string UserID)
        {
            var user = await _userManager.FindByIdAsync(UserID);
            if (user is null)
            {
                return ResponseKeys.UserNotFound.ToString();
            }
            var Instructor = await GetInstructorByUserID(user.Id);

            if(Instructor is null)
            {
                return ResponseKeys.UserNotFound.ToString();
            }

            var courses = await _context.Courses
           .Where(c => c.InstructorId == Instructor.Id)
           .ToListAsync();

            foreach (var course in courses)
            {
                course.InstructorId = null;
            }
            _IBaseRepository.Update(Instructor);

            var Result = await _userManager.DeleteAsync(user);
            if (!Result.Succeeded)
            {
                return ResponseKeys.Failed.ToString();
            }

            if (!string.IsNullOrEmpty(user.ProfileImage))
            {
                _ImageHelper.DeleteImage(user.ProfileImage);
            }

            return ResponseKeys.Success.ToString();

        }
        public async Task<string> AddCoursesToInstructor(InstructorCoursesManage model)
        {
            var Instructor = await GetInstructorByUserID(model.UserId);

            if (Instructor is null)
            {
                return ResponseKeys.UserNotFound.ToString();
            }
            var InstructorUser = await _userManager.FindByIdAsync(model.UserId);
            //if (!await _userManager.IsInRoleAsync(InstructorUser, Roles.Instructor.ToString()))
            //{
            //    return ResponseKeys.UnauthorizedAccess.ToString();
            //}
            foreach (var CourseId in model.CoursesIds)
            {
                var course = await _context.Courses.FindAsync(CourseId);
                if (course is null)
                {
                    return ResponseKeys.CourseNotFound.ToString();
                }

                course.InstructorId = Instructor.Id;

                _IBaseRepository.Update(course);
            }

            return ResponseKeys.Success.ToString();
        }
        public async Task<string> RemoveCoursesFromInstructor(InstructorCoursesManage model)
        {

            var Instructor = await GetInstructorByUserID(model.UserId);

            if (Instructor is null)
            {
                return ResponseKeys.UserNotFound.ToString();
            }
            var InstructorUser = await _userManager.FindByIdAsync(model.UserId);
            //if (!await _userManager.IsInRoleAsync(InstructorUser, Roles.Instructor.ToString()))
            //{
            //    return ResponseKeys.UnauthorizedAccess.ToString();
            //}
            foreach(var CourseId in model.CoursesIds)
            {
                var course = await _context.Courses.FindAsync(CourseId);

                if(course is null)
                {
                    return ResponseKeys.CourseNotFound.ToString();
                }
                course.InstructorId = null;
                _IBaseRepository.Update(course);
            }
            return ResponseKeys.Success.ToString();
        }
        public async Task<string> ChangeInstructorPassword(ChangePasswordAdminForm model)
        {
            var user = await _userManager.FindByIdAsync(model.UserId);
            if (user is null)
            {
                return ResponseKeys.UserNotFound.ToString();
            }
            var token = await _userManager.GeneratePasswordResetTokenAsync(user);

            IdentityResult result = await _userManager.ResetPasswordAsync(user, token, model.NewPassword);

            if (!result.Succeeded)
            {

                return ResponseKeys.Failed.ToString();

            }
            return ResponseKeys.Success.ToString();
        }
        public async Task<PaginationResult<GetCoursesMainInfo>> CoursesNotTaughtByInstructor(int pageNumber, int pageSize, string UserId)
        {
            var instructor = await GetInstructorByUserID(UserId);

            var user = await _userManager.FindByIdAsync(UserId);

            var query = _context.Courses
                .Where(course => course.InstructorId != instructor.Id) 
                .Select(course => new GetCoursesMainInfo
                {
                    Id = course.Id,
                    Image = course.Image,
                    Name = course.Name,
                    Price = course.Price,
                    DiscountPrice = course.DiscountPrice,
                    StudentsCount = course.Enrollments.Count,
                    InstructorName = $"{user.FirstName} {user.LastName}",
                    Status = course.Status.ToString(),
                })
                .AsQueryable();

            var paginationResult = await PaginationHelper.PaginateAsync(query, pageNumber, pageSize);

            return paginationResult;
        }
        public async Task<PaginationResult<GetCoursesMainInfo>> InstructorCourses(int pageNumber, int pageSize,string UserId)
        {
            var instructor = await GetInstructorByUserID(UserId);
            var user = await _userManager.FindByIdAsync(UserId);
            var query = _context.Courses
                .Where(Course => Course.InstructorId == instructor.Id)
                 .Select(course => new GetCoursesMainInfo
                 {
                     Id = course.Id,
                     Image = course.Image,
                     Name = course.Name,
                     Price = course.Price,
                     DiscountPrice = course.DiscountPrice,
                     StudentsCount = course.Enrollments.Count,
                     InstructorName = $"{user.FirstName} {user.LastName}",
                     Status = course.Status.ToString(),
                 }).AsQueryable();

            var paginationResult = await PaginationHelper.PaginateAsync(query, pageNumber, pageSize);

            return paginationResult;
      
        }
        public async Task<List<GetCoursesMainInfo>> FilterInstructorCourses(string Name, string UserId)
        {
            var instructor = await GetInstructorByUserID(UserId);

            if (instructor == null)
            {
                return new List<GetCoursesMainInfo>();
            }

            var user = await _userManager.FindByIdAsync(UserId);

            var courses = await _context.Courses
                .Where(Course => Course.InstructorId == instructor.Id &&
                       Course.Name.ToLower().Contains(Name.ToLower()))
                .Select(course => new GetCoursesMainInfo
                {
                    Id = course.Id,
                    Image = course.Image,
                    Name = course.Name,
                    Price = course.Price,
                    DiscountPrice = course.DiscountPrice,
                    StudentsCount = course.Enrollments.Count,
                    InstructorName = $"{user.FirstName} {user.LastName}",
                    Status = course.Status.ToString(),
                }).ToListAsync();


            return courses;
        }
        public async Task<List<GetCoursesMainInfo>> FilterCoursesNotTaughtByInstructor(string Name, string UserId)
        {
            var instructor = await GetInstructorByUserID(UserId);

            if (instructor == null)
            {
                return new List<GetCoursesMainInfo>();
            }

            var user = await _userManager.FindByIdAsync(UserId);

            var courses = await _context.Courses
                .Where(course => course.InstructorId != instructor.Id &&
                 course.Name.ToLower().Contains(Name.ToLower()))
                .Select(course => new GetCoursesMainInfo
                {
                    Id = course.Id,
                    Image = course.Image,
                    Name = course.Name,
                    Price = course.Price,
                    DiscountPrice = course.DiscountPrice,
                    StudentsCount = course.Enrollments.Count,
                    InstructorName = $"{user.FirstName} {user.LastName}",
                    Status = course.Status.ToString(),
                })
                .ToListAsync();

            return courses;
        }
        private async Task<Instructor> GetInstructorByUserID(string userId)
        {
            var Instructor = await _context.Instructors.FirstOrDefaultAsync(s => s.UserId == userId);
            return Instructor;
        }
 

    }
}
