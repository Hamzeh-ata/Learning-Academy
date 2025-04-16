using Arkan.Server.BaseRepository;
using Arkan.Server.Client_Interfaces;
using Arkan.Server.Client_PageModels.CourseStudents;
using Arkan.Server.Client_PageModels.Instrctors;
using Arkan.Server.Client_PageModels.InstructorQuiz;
using Arkan.Server.Data;
using Arkan.Server.Enums;
using Arkan.Server.Helpers;
using Microsoft.EntityFrameworkCore;
using System.Drawing.Printing;
using System.Xml.Linq;

namespace Arkan.Server.Client_Repositories
{
    public class CourseStudentsRepository : ICourseStudents
    {
        private readonly ApplicationDBContext _context;
        private readonly IBaseRepository _IBaseRepository;
        public CourseStudentsRepository(ApplicationDBContext context, IBaseRepository IBaseRepository)
        {
            _context = context;
            _IBaseRepository = IBaseRepository;
        }

        public async Task<PaginationResult<CourseStudents>> GetCourseStudents(GetCourseStudents model,string userId)
        {


            var instuctorId = await _IBaseRepository.GetInstructorIdByUserID(userId);

            if(instuctorId == 0)
            {
                return new PaginationResult<CourseStudents>();
            }

            var isTeachingCourse = await IsTeachingCourse(model.CourseId, instuctorId);

            if (!isTeachingCourse)
            {
                return new PaginationResult<CourseStudents>();
            }

            var query = _context.Enrollments
            .Where(e => e.CourseId == model.CourseId)
            .Include(e => e.Student)
            .WhereIf(model.StudentName != null, e => e.Student.User.FirstName.ToLower().Contains(model.StudentName.Trim().ToLower())
            || e.Student.User.LastName.ToLower().Contains(model.StudentName.Trim().ToLower()))
            .Select(e => new CourseStudents
            {
                UserId = e.Student.UserId,
                Id = e.Student.Id,
                Email = e.Student.User.Email,
                Name = e.Student.User.FirstName + " " + e.Student.User.LastName,
                Image = e.Student.User.ProfileImage,
                EnrollmentDate = e.EnrollmentDate
               
            }).AsQueryable();

            var paginationResult = await PaginationHelper.PaginateAsync(query, model.PageNumber, model.PageSize);

            return paginationResult;
        }
        private async Task<bool> IsTeachingCourse(int courseId, int InstructorId)
        {
            var courseInstructorId = await _context.Courses
                .Where(c => c.Id == courseId)
                .Select(c => c.InstructorId)
                .FirstOrDefaultAsync();

            return courseInstructorId == InstructorId;
        }
    }
}
