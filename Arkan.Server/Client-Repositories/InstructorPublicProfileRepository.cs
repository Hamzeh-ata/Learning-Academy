using Arkan.Server.BaseRepository;
using Arkan.Server.Client_Interfaces;
using Arkan.Server.Data;
using Arkan.Server.Enums;
using Arkan.Server.Models;
using Arkan.Server.PageModels.InstructorProfileModels;
using Arkan.Server.RoleServices;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace Arkan.Server.Client_Repositories
{
    public class InstructorPublicProfileRepository: IInstructorPublicProfile
    {

        private readonly ApplicationDBContext _context;
        public InstructorPublicProfileRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task<GetInstructorPublicProfile> GetProfileAsync(int instructorId)
        {
            var instructor = await _context.Instructors
                .Where(i => i.Id == instructorId)
                .Include(i => i.User)
                .FirstOrDefaultAsync();

            if (instructor is null)
            {
                return new GetInstructorPublicProfile
                {
                    Key = ResponseKeys.UserNotFound.ToString()
                };
            }

            var instructorCourses = await _context.Courses
                .Where(c => c.InstructorId == instructor.Id)
                .Select(c => new InstructorProfileCourses
                {
                    Id = c.Id,
                    Image = c.Image,
                    Name = c.Name,
                    Description = c.Description,
                }).ToListAsync();

            int studentsCount = instructorCourses.Sum(c =>
                _context.Enrollments.Count(e => e.CourseId == c.Id));

            int lessonsCount = instructorCourses.Sum(c =>
                _context.Chapters.Where(ch=>ch.CourseId == c.Id).Select(ch=>ch.Lessons).Count());

            return new GetInstructorPublicProfile
            {
                Id = instructor.Id,
                UserId = instructor.UserId,
                Name = $"{instructor.User.FirstName} {instructor.User.LastName}", 
                Email = instructor.User.Email,
                Bio = instructor.Bio,
                Phone = instructor.User.PhoneNumber,
                Specialty = instructor.Specialization,
                Location = instructor.Location,
                linkedin = instructor.LinkedIn,
                Facebook = instructor.Facebook,
                Instagram = instructor.Instagram,
                Twitter = instructor.Twitter,
                Experience = instructor.Experience,
                OfficeHours = instructor.OfficeHours,
                Image = instructor.User.ProfileImage,
                StudentsCount = studentsCount,
                CoursesCount = instructorCourses.Count(),
                LessonsCount = lessonsCount,
                Sex = instructor.Sex,
                Courses = instructorCourses,
                ShowStudentsCount = instructor.showStudentsCount,
                Key = ResponseKeys.Success.ToString(),
            };
        }
    }
}
