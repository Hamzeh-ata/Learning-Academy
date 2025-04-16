using Arkan.Server.BaseRepository;
using Arkan.Server.Client_Interfaces;
using Arkan.Server.Client_PageModels.Instrctors;
using Arkan.Server.Client_PageModels.MyCourses;
using Arkan.Server.Data;
using Arkan.Server.Enums;
using Arkan.Server.Helpers;
using Arkan.Server.Models;
using Arkan.Server.PageModels.CourseModels;
using Microsoft.EntityFrameworkCore;
using System.Drawing.Printing;

namespace Arkan.Server.Client_Repositories
{
    public class MyCoursesRepository : IMyCourses
    {
        private readonly ApplicationDBContext _context;
        private readonly IBaseRepository _IBaseRepository;
        public MyCoursesRepository(ApplicationDBContext context, IBaseRepository IBaseRepository)
        {
            _context = context;
            _IBaseRepository = IBaseRepository;
        }
        public async Task<PaginationResult<GetMyCourses>> GetUserCourses(string userId,int pageNumber ,int pageSize)
        {
            var userRole = await _IBaseRepository.FindUserRole(userId);

            if (userRole is null)
            {
                return new PaginationResult<GetMyCourses>
                {
                    TotalCount = 0,
                };
            }


            if (userRole == Roles.Instructor.ToString())
            {
                var instructorId = await _IBaseRepository.GetInstructorIdByUserID(userId);

                var instructorCourses = _context.Courses
                    .Where(c => c.InstructorId == instructorId)
                    .Select(c => new GetMyCourses
                    {
                        Id = c.Id,
                        Name = c.Name,
                        Description = c.Description,
                        Image = c.Image,
                    }).AsQueryable();

                var instructorPaginationResult = await PaginationHelper.PaginateAsync(instructorCourses, pageNumber, pageSize);

                return instructorPaginationResult;
            }

            var studentId = await _IBaseRepository.GetStudentIdByUserId(userId);

            var studentCourses = _context.Enrollments
             .Include(e => e.Course)
             .Where(e => e.StudentId == studentId)
             .Select(enroll => new GetMyCourses
             {
                 Id = enroll.Course.Id,
                 Name = enroll.Course.Name,
                 Description = enroll.Course.Description,
                 Image = enroll.Course.Image,
             })
             .AsQueryable();

            var StudentPaginationResult = await PaginationHelper.PaginateAsync(studentCourses, pageNumber, pageSize);

            return StudentPaginationResult;
        }

    }
}
