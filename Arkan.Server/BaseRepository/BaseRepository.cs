using Arkan.Server.Data;
using Arkan.Server.Enums;
using Arkan.Server.Models;
using Microsoft.EntityFrameworkCore;
using System.Runtime.InteropServices;

namespace Arkan.Server.BaseRepository
{
    public class BaseRepository : IBaseRepository
    {
        private readonly ApplicationDBContext _context;
        public BaseRepository(ApplicationDBContext context) {
            _context = context; 
        }
        public bool Add<T>(T entity)
        {
            _context.Add(entity);
            return Save();
        }
        public async Task<bool> AddAsync<T>(T entity)
        {
            await _context.AddAsync(entity);
            return await SaveAsync();
        }
        public async Task<bool> SaveAsync()
        {
            var Saved = await _context.SaveChangesAsync();
            return  Saved > 0 ? true : false;
        }
        public bool Remove<T>(T entity)
        {
            _context.Remove(entity);
            return Save();
        }
        public bool Save()
        {
            var Saved = _context.SaveChanges();
            return Saved > 0 ? true : false;
        }
        public bool Update<T>(T entity)
        {
            _context.Update(entity);
            return Save();
        }
        public bool RemoveRange<T>(IEnumerable<T> entities) where T : class
        {
            _context.Set<T>().RemoveRange(entities);
            return Save();
        }
        public bool AddRange<T>(IEnumerable<T> entities) where T : class
        {
            _context.Set<T>().AddRange(entities);
            return Save();
        }
        public async Task<bool> AddRangeAsync<T>(IEnumerable<T> entities) where T : class
        {
           await _context.Set<T>().AddRangeAsync(entities);
           return await SaveAsync();
        }
        public async Task<T> FindByIdAsync<T>(int? id) where T : class
        {
           return await _context.Set<T>().FindAsync(id);
        }
        public async Task<List<T>> GetAllById<T>(int? id) where T : class
       {
            return await _context
                .Set<T>()
                .Where(e => EF.Property<int>(e, "Id") == id)
                .ToListAsync();
       }
        public async Task<bool> AnyByIdAsync<T>(int? id) where T : class
        {
            return await _context
                .Set<T>()
                .AnyAsync(e => EF.Property<int>(e, "Id") == id);
        }
        public async Task<int> GetStudentIdByUserId(string userId)
        {
            var studentId = await _context.Students
                .Where(s => s.UserId == userId)
                .Select(s => s.Id)
                .FirstOrDefaultAsync();

            return studentId;
        }
        public async Task<int> GetInstructorIdByUserID(string? userId)
        {
            var instructorId = await _context.Instructors
                                       .Where(s => s.UserId == userId)
                                       .Select(s => s.Id)
                                       .FirstOrDefaultAsync();
            return instructorId;
        }
        public async Task<Instructor> GetInstructorByUserID(string userId)
        {
            var Instructor = await _context.Instructors.FirstOrDefaultAsync(s => s.UserId == userId);
            return Instructor;
        }
        public async Task<string> FindUserRole(string UserId)
        {
            var userRole = await _context.UsersRoles
                .Where(ur => ur.UserId == UserId)
                .Select(ur => ur.Role.Name)
                .SingleOrDefaultAsync();
            return userRole;
        }
        public DateTime GetJordanTime()
        {
            DateTime utcNow = DateTime.UtcNow;
            TimeZoneInfo jordanTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Jordan Standard Time");
            DateTime jordanTime = TimeZoneInfo.ConvertTimeFromUtc(utcNow, jordanTimeZone);
            return jordanTime;
        }
        public async Task<bool> IsStudentEnrolledInLesson(string userId,int lessonId)
        {
            int studentId = await GetStudentIdByUserId(userId);

            if (studentId == 0)
            {
                return false;
            }

            var enrolledCourses = await _context.Enrollments
                .Where(e => e.StudentId == studentId)
                .Select(e=> e.CourseId)
                .ToListAsync();

            if (!enrolledCourses.Any())
            {
                return false;
            }

            var courseId = await _context.Lessons
           .Where(l => l.Id == lessonId)
           .Select(l => l.Chapter.CourseId) 
           .FirstOrDefaultAsync();
          
            if (courseId == 0)
            {
                return false;
            }

            return enrolledCourses.Contains(courseId);
        }
        public async Task<List<string>> GetCourseEnrolledUserIds(int lessonId)
        {
            var courseId = await _context.Lessons
             .Where(l => l.Id == lessonId)
             .Select(l => l.Chapter.CourseId)
             .FirstOrDefaultAsync();

            return await _context.Enrollments
               .Where(e => e.CourseId == courseId)
               .Select(e => e.Student.UserId)
               .ToListAsync();
        }
        public async Task<List<string>> GetUsersIdsByRoles(List<string> roles)
        {
            return await _context.UsersRoles
                .Where(ur => roles.Contains(ur.Role.Name))
                .Select(ur => ur.UserId) 
                .ToListAsync();
        }
        public async Task<List<string>> GetUsersIdsByRole(string role)
        {
            return await _context.UsersRoles
                .Where(ur => ur.Role.Name == role)
                .Select(ur => ur.UserId)
                .ToListAsync();
        }

        public async Task<List<string>> GetAdminUsers()
        {
            return await _context.UsersRoles
                .Where(ur => ur.Role.Name != Roles.Instructor.ToString() 
                && ur.Role.Name != Roles.Student.ToString())
                .Select(ur => ur.UserId)
                .ToListAsync();
        }




    }
}
