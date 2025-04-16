using Arkan.Server.BaseRepository;
using Arkan.Server.Data;
using Arkan.Server.Enums;
using Arkan.Server.Helpers;
using Arkan.Server.ImagesHelper;
using Arkan.Server.Interfaces;
using Arkan.Server.LoggerFilter;
using Arkan.Server.Models;
using Arkan.Server.Notifications;
using Arkan.Server.PageModels.CourseModels;
using Arkan.Server.PageModels.StudentModels;
using Arkan.Server.StudentModels;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Arkan.Server.Repository
{
    public class StudentRepository : IStudentInterface
    {
        private readonly ApplicationDBContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IBaseRepository _IBaseRepository;
        private readonly ImageHelperInterface _ImageHelperInterface;
        private readonly INotificationService _NotificationService;
        private readonly ILoggerService _ILoggerService;

        public StudentRepository(
         ApplicationDBContext context,
         UserManager<ApplicationUser> userManager,
         IBaseRepository IBaseRepository,
         ImageHelperInterface ImageHelperInterface ,
         INotificationService NotificationService,
         ILoggerService loggerService)
        {
            _context = context;
            _userManager = userManager;
            _IBaseRepository = IBaseRepository;
            _ImageHelperInterface = ImageHelperInterface;
            _NotificationService = NotificationService;
            _ILoggerService = loggerService;
        }
        public async Task<PaginationResult<StudentMainInfo>> GetAll(int pageNumber, int pageSize)
        {
            var query = _context.Students
           .Include(s => s.User)
           .Select(s=> new StudentMainInfo
           {
               Id = s.User.Id,
               Email = s.User.Email,
               phoneNumber = s.User.PhoneNumber,
               CoursesCount = _context.Enrollments.Count(e => e.StudentId == s.Id),
               FirstName = s.User.FirstName,
               LastName = s.User.LastName,
               Image = s.User.ProfileImage
           }).AsQueryable();

            var paginationResult = await PaginationHelper.PaginateAsync(query, pageNumber, pageSize);

            return paginationResult;
        }
        public async  Task<StudentAuth> AddStudentInfoAsync(StudentInformation studentInformation)
        {
            var user = await _userManager.FindByIdAsync(studentInformation.UserId);

            if (user is null)
            {
                return new StudentAuth { Key = ResponseKeys.UserNotFound.ToString() };
            }
           
            if (studentInformation.Email is null)
            {
                return new StudentAuth { Key = ResponseKeys.EmptyEmail.ToString() };
            }

            var userByEmail = await _userManager.FindByEmailAsync(studentInformation.Email);

            if (userByEmail != null && userByEmail.Id != user.Id)
            {
                return new StudentAuth { Key = ResponseKeys.EmailExists.ToString() };
            }

            if (studentInformation.FirstName is null)
            {
                return new StudentAuth { Key = ResponseKeys.EmptyFirstName.ToString() };
            }
            if (studentInformation.LastName is null)
            {
                return new StudentAuth { Key = ResponseKeys.EmptyLastName.ToString() };
            }
            if (studentInformation.PhoneNumber is null)
            {
                return new StudentAuth { Key = ResponseKeys.EmptyPhone.ToString() };
            }
            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    var student = await _context.Students.FirstOrDefaultAsync(s => s.UserId == user.Id);

                    if (studentInformation.Image != null)
                    {
                        if (!string.IsNullOrEmpty(user.ProfileImage))
                        {
                             _ImageHelperInterface.DeleteImage(user.ProfileImage);
                        }

                        user.ProfileImage = await _ImageHelperInterface.AddImage(studentInformation.Image, ImagesFiles.students.ToString());
                    }

                    student.University = studentInformation.University;
                    user.FirstName = studentInformation.FirstName;
                    user.LastName = studentInformation.LastName;
                    user.Email = studentInformation.Email;
                    user.NormalizedEmail = studentInformation.Email.ToUpper();
                    user.NormalizedUserName = studentInformation.Email.ToUpper();
                    user.PhoneNumber = studentInformation.PhoneNumber;
                    user.UserName = studentInformation.Email;
                    student.BirthDate = studentInformation.BirthDate;
                    student.Sex = studentInformation.Sex;
                    var result = await _userManager.UpdateAsync(user);

                    if (!result.Succeeded)
                    {
                        return new StudentAuth { Key = ResponseKeys.Failed.ToString() };
                    }
                    _IBaseRepository.Update(student);

                    await transaction.CommitAsync();

                    return new StudentAuth
                    {
                        University = student.University,
                        FirstName = user.FirstName,
                        LastName = user.LastName,
                        Email = user.Email,
                        PhoneNumber = user.PhoneNumber,
                        BirthDate = student.BirthDate,
                        Sex = student.Sex,
                        Image = user.ProfileImage,
                        UserId = user.Id,
                        Key=ResponseKeys.Success.ToString(),
                    };

                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();

                    return new StudentAuth
                    {
                        Key = "An error occurred while updating student information: " + ex.Message
                    };
                }
            }
        }
        public async Task<PaginationResult<GetCoursesMainInfo>> GetStudentCourses(int pageNumber, int pageSize,string UserID)
        {
            var user = await _userManager.FindByIdAsync(UserID);

            var student = await GetStudentByUserID(UserID);

            var query = _context.Enrollments
                .Include(e => e.Course)
                .Where(e => e.StudentId == student.Id)
                .Select(enroll=> new GetCoursesMainInfo
                {
                    Id = enroll.Course.Id,
                    Image = enroll.Course.Image,
                    Name = enroll.Course.Name,
                    Description = enroll.Course.Description,
                    Price = enroll.Course.Price,
                    DiscountPrice = enroll.Course.DiscountPrice,
                    OffLinePrice = enroll.Course.DirectPrice,
                    StudentsCount = enroll.Course.Enrollments.Count,
                    InstructorName = enroll.Course.InstructorId.HasValue
                   ? $"{enroll.Course.Instructor!.User.FirstName} {enroll.Course.Instructor.User.LastName}"
                   : null,
                    Status = enroll.Course.Status.ToString(),
                })
                .AsQueryable();

            var paginationResult = await PaginationHelper.PaginateAsync(query, pageNumber, pageSize);


            return paginationResult;
        }
        public async Task<StudentAuth> UpdateStudentInfoAsync(StudentInformation studentInformation)
        {

            var user = await _userManager.FindByIdAsync(studentInformation.UserId);

            if (user is null)
            {
                return new StudentAuth { Key = ResponseKeys.UserNotFound.ToString() };
            }

        
            if (studentInformation.Email is null)
            {
                return new StudentAuth { Key = ResponseKeys.EmptyEmail.ToString() };
            }

            var userByEmail = await _userManager.FindByEmailAsync(studentInformation.Email);

            if (userByEmail != null && userByEmail.Id != user.Id)
            {
                return new StudentAuth { Key = ResponseKeys.EmailExists.ToString() };
            }

            if (studentInformation.FirstName is null)
            {
                return new StudentAuth { Key = ResponseKeys.EmptyFirstName.ToString() };
            }
            if (studentInformation.LastName is null)
            {
                return new StudentAuth { Key = ResponseKeys.EmptyLastName.ToString() };
            }
            if (studentInformation.PhoneNumber is null)
            {
                return new StudentAuth { Key = ResponseKeys.EmptyPhone.ToString() };
            }
            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    var student = _context.Students.FirstOrDefault(s => s.UserId == user.Id);

                    if (studentInformation.Image != null && !(studentInformation.Image is string))
                    {
                        if (!string.IsNullOrEmpty(user.ProfileImage))
                        {
                            _ImageHelperInterface.DeleteImage(user.ProfileImage);
                        }
                        user.ProfileImage = await _ImageHelperInterface.AddImage(studentInformation.Image, ImagesFiles.students.ToString());
                    }

                    student.University = studentInformation.University;
                    user.FirstName = studentInformation.FirstName;
                    user.LastName = studentInformation.LastName;
                    user.Email = studentInformation.Email;
                    user.NormalizedEmail = studentInformation.Email.ToUpper();
                    user.NormalizedUserName = studentInformation.Email.ToUpper();
                    user.PhoneNumber = studentInformation.PhoneNumber;
                    user.UserName = studentInformation.Email;
                    student.BirthDate = studentInformation.BirthDate;
                    student.Sex = studentInformation.Sex;

                    var result = await _userManager.UpdateAsync(user);
                    if (!result.Succeeded)
                    {
                        return new StudentAuth { Key = ResponseKeys.Failed.ToString() };
                    }
                    _IBaseRepository.Update(student);
                    await transaction.CommitAsync();

                    return new StudentAuth
                    {
                        Image = user.ProfileImage,
                        University = student.University,
                        FirstName = user.FirstName,
                        LastName = user.LastName,
                        Email = user.Email,
                        PhoneNumber = studentInformation.PhoneNumber,
                        BirthDate = student.BirthDate,
                        Sex = student.Sex,
                        UserId = user.Id,
                        Key=ResponseKeys.Success.ToString()
                    };

                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();

                    return new StudentAuth
                    {
                        Key = ResponseKeys.Failed.ToString()
                    };
                }
            }
        }
        public async Task<AllStudentInformation> GetStudentInfoAsync(string userId)
        {

           var user = await _userManager.FindByIdAsync(userId);

           if (user is null)
            {
                return new AllStudentInformation { Key = ResponseKeys.UserNotFound.ToString() };
            }
 
            var student = await _context.Students.FirstOrDefaultAsync(s => s.UserId == user.Id);

            return new AllStudentInformation
            {   UserId = user.Id,
                Image = user.ProfileImage,
                University = student.University,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber,
                BirthDate = student.BirthDate,
                Sex = student.Sex,
                Key = ResponseKeys.Success.ToString(),
            
            };
        }
        public async Task<string> DeleteStudent(string UserID , string currentUserId)
        {
            var user = await _userManager.FindByIdAsync(UserID);

            if (user is null)
            {
                return ResponseKeys.UserNotFound.ToString();
            }

            var Result = await _userManager.DeleteAsync(user);

            if (!Result.Succeeded)
            {
                return ResponseKeys.Failed.ToString(); 
            }

            if (!string.IsNullOrEmpty(user.ProfileImage))
            {
                await _ImageHelperInterface.DeleteImage(user.ProfileImage);
            }

            await _ILoggerService.AddLog(currentUserId, ActionTypes.Delete.ToString(), ItemsType.Student.ToString(), user.FirstName);

            return ResponseKeys.Success.ToString();
        }
        public async Task<string> ChangeStudentPassword(ChangePasswordAdminForm model, string currentUserId)
        {
            var user = await _userManager.FindByIdAsync(model.UserId);

            if (user is null)
            {
                return ResponseKeys.UserNotFound.ToString();
            }

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);

            IdentityResult result = await _userManager.ResetPasswordAsync(user, token, model.NewPassword);

            if(!result.Succeeded)
            {
                return ResponseKeys.Failed.ToString();
            }

            await _ILoggerService.AddLog(currentUserId, ActionTypes.ChangePassword.ToString(), ItemsType.Student.ToString(), user.FirstName);

            return ResponseKeys.Success.ToString();
        }
        public async Task<string> AddCoursesToStudent(AddCoursesToStudent model)
        {
            var Student = await GetStudentByUserID(model.UserId);

            if (Student is null)
            {
                return ResponseKeys.UserNotFound.ToString();
            }

            foreach(var CourseId in model.CourseId)
            {
                var IsCourseExists = await _context.Courses.AnyAsync(course => course.Id == CourseId);

                if (!IsCourseExists)
                {
                    return "The Course with id: " + CourseId + " does not exist. ";
                }
                var IsEnrollmentBefore = await _context.Enrollments.AnyAsync(Enrollment => Enrollment.CourseId == CourseId && Enrollment.StudentId == Student.Id);

                if (IsEnrollmentBefore)
                {
                    return "The Course with id: " + CourseId + " is registered before for the student";
                }
                var CoursesEnrollment = new Enrollment
                {
                    CourseId = CourseId,
                    StudentId = Student.Id,
                    EnrollmentDate = DateTime.Now,
                };

                await _IBaseRepository.AddAsync<Enrollment>(CoursesEnrollment);

                (int? instructorId, string courseName) = await GetCourseNameAndInstructorId(CourseId);

                if (instructorId.HasValue && instructorId > 0)
                {
                    var instructorUserId = await GetInstructorUserId(instructorId);

                    await CreateStudentInstructorRoom(model.UserId, instructorUserId);

                    string notificationMessage = $"{Student.User.FirstName} {Student.User.LastName} has registered for the course \"{courseName}\".";

                    await _NotificationService.Notify("client", notificationMessage, instructorUserId);
                }

            }

            return ResponseKeys.Success.ToString();

        }
        public async Task<string> RemoveStudentFromCourses(RemoveStudentFromCourses model)
        {
            var student = await GetStudentByUserID(model.UserId);

            if (student == null)
            {
                return ResponseKeys.UserNotFound.ToString();
            }

            foreach (var courseId in model.CourseId)
            {
                var course = await _context.Courses.FindAsync(courseId);

                if (course == null)
                {
                    return "The Course with id: " + courseId + " does not exist.";
                }

                var enrollment = await _context.Enrollments.FirstOrDefaultAsync(e =>
                    e.CourseId == courseId && e.StudentId == student.Id);

                if (enrollment == null)
                {
                    return "The Student is not registered for the course with id: " + courseId + ".";
                }

                _IBaseRepository.Remove(enrollment);
            }

            var quizAttempts = await _context.UserQuizAttempt
                .Where(u => u.UserId == model.UserId && model.CourseId.Contains(u.Quiz.Lesson.Chapter.CourseId))
                .ToListAsync();

            _IBaseRepository.RemoveRange<UserQuizAttempt>(quizAttempts);

            return ResponseKeys.Success.ToString();
        }
        public async Task<PaginationResult<GetCoursesMainInfo>> GetCoursesNotEnrolledByStudent(int pageNumber, int pageSize,string UserId)
        {
            var student = await GetStudentByUserID(UserId);

            //Get courses ids that student enrolled in
            var enrolledCourseIds = await _context.Enrollments
                                            .Where(e => e.StudentId == student.Id)
                                            .Select(e => e.CourseId)
                                            .ToListAsync();

            var query = _context.Courses
                .Where(Course => !enrolledCourseIds.Contains(Course.Id))
                .Select(course => new GetCoursesMainInfo
                {
                    Id = course.Id,
                    Image = course.Image,
                    Name = course.Name,
                    Price = course.Price,
                    DiscountPrice = course.DiscountPrice,
                    StudentsCount = course.Enrollments.Count,
                    Description = course.Description,
                    OffLinePrice = course.DirectPrice,
                    InstructorName = course.InstructorId.HasValue
                   ? $"{course.Instructor!.User.FirstName} {course.Instructor.User.LastName}"
                   : null,
                    Status = course.Status.ToString(),
                }).AsQueryable();

            var paginationResult = await PaginationHelper.PaginateAsync(query, pageNumber, pageSize);

            return paginationResult;
        }
        public async Task<List<GetCoursesMainInfo>> FilterStudentNonEnrollCourses(string Name, string UserId)
        {
            var student = await GetStudentByUserID(UserId);
            if (student == null)
            {
                return new List<GetCoursesMainInfo>();
            }

            var courses = await _context.Courses
            .Where(course =>
                   !course.Enrollments.Any(enrollment => enrollment.StudentId == student.Id) &&
                   course.Name.ToLower().Contains(Name.ToLower()))
            .Select(course => new GetCoursesMainInfo
            {
                Id = course.Id,
                Image = course.Image,
                Name = course.Name,
                Price = course.Price,
                DiscountPrice = course.DiscountPrice,
                StudentsCount = course.Enrollments.Count,
                InstructorName = course.InstructorId.HasValue ?
                    $"{course.Instructor!.User.FirstName} {course.Instructor.User.LastName}" :
                    null,
                Status = course.Status.ToString(),
                OffLinePrice = course.DirectPrice
            })
            .ToListAsync();

            return courses;
        }
        public async Task<List<GetCoursesMainInfo>> FilterStudentCourses(string Name, string UserId)
        {

            var student = await GetStudentByUserID(UserId);
            if (student == null)
            {
                return new List<GetCoursesMainInfo>();
            }

            var courses = await _context.Courses
            .Where(course =>
                course.Enrollments.Any(enrollment => enrollment.StudentId == student.Id) &&
                course.Name.ToLower().Contains(Name.ToLower()))
            .Select(course => new GetCoursesMainInfo
            {
                Id = course.Id,
                Image = course.Image,
                Name = course.Name,
                Price = course.Price,
                DiscountPrice = course.DiscountPrice,
                StudentsCount = course.Enrollments.Count,
                InstructorName = course.InstructorId.HasValue ?
                    $"{course.Instructor!.User.FirstName} {course.Instructor.User.LastName}" :
                    null,
                Status = course.Status.ToString(),
                OffLinePrice = course.DirectPrice
            })
            .ToListAsync();

            return courses;
        }
        private async Task<Student> GetStudentByUserID(string userId)
        {
            var student = await _context.Students
                .Where(s => s.UserId == userId)
                .Include(s=> s.User)
                .FirstOrDefaultAsync();

            return student;
        }
        private async Task<int> GetStudentsCoursesCount(string userId)
        {
            var Student = GetStudentByUserID(userId);
            if (Student == null)
            {
                return 0; 
            }
            var CoursesCount = await _context.Enrollments
           .Where(enrollment => enrollment.StudentId == Student.Id)
           .CountAsync();

            return CoursesCount;
        }
        private async Task<string> GetInstructorUserId(int? id)
        {
            return await _context.Instructors
                .Where(i => i.Id == id)
                .Select(i => i.UserId)
                .FirstAsync();
        }
        private async Task<(int? InstructorId, string CourseName)> GetCourseNameAndInstructorId(int courseId)
        {
            var result = await _context.Courses
                .Where(c => c.Id == courseId)
                .Select(c => new { c.InstructorId, c.Name })
                .FirstOrDefaultAsync();

            return (result?.InstructorId, result?.Name);
        }
        private async Task CreateStudentInstructorRoom(string studentId, string instructorId)
        {
            var isRoomExists = await _context.ClientChatRoom
                .AnyAsync(ccr => (ccr.Participant1Id == studentId && ccr.Participant2Id == instructorId) 
                || (ccr.Participant2Id == studentId && ccr.Participant1Id == instructorId));

            if(isRoomExists)
            {
                return;
            }

            var chatRoom = new ClientChatRoom
            {
                Participant1Id = studentId,
                Participant2Id = instructorId,
                DateCreated = _IBaseRepository.GetJordanTime()
            };

            await _IBaseRepository.AddAsync<ClientChatRoom>(chatRoom);
        }
    }
}
