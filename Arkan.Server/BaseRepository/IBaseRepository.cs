using Arkan.Server.Models;

namespace Arkan.Server.BaseRepository
{
    public interface IBaseRepository
    {
        Task<T> FindByIdAsync<T>(int? id) where T : class;

        Task<List<T>> GetAllById<T>(int? id) where T : class;

        Task<bool> AnyByIdAsync<T>(int? id) where T : class;
        bool Add<T>(T entity);
        Task<bool> AddAsync<T>(T entity);
        bool Remove<T>(T entity);
        bool Update<T>(T entity);
        bool RemoveRange<T>(IEnumerable<T> entities) where T : class;
        bool AddRange<T>(IEnumerable<T> entities) where T : class;
        Task<bool> AddRangeAsync<T>(IEnumerable<T> entities) where T : class;
        bool Save();
        Task<bool> SaveAsync();
        Task<int> GetStudentIdByUserId(string userId);
        Task<int> GetInstructorIdByUserID(string? userId);
        Task<Instructor> GetInstructorByUserID(string userId);
        Task<string> FindUserRole(string UserId);
        DateTime GetJordanTime();
        Task<bool> IsStudentEnrolledInLesson(string userId, int lessonId);
        Task<List<string>> GetCourseEnrolledUserIds(int courseId);
        Task<List<string>> GetUsersIdsByRoles(List<string> roles);
        Task<List<string>> GetUsersIdsByRole(string role);
        Task<List<string>> GetAdminUsers();

    }
}
