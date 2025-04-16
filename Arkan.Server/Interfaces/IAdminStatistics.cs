using Arkan.Server.Helpers;
using Arkan.Server.PageModels.OrdersModels;
using Arkan.Server.PageModels.Statistics;

namespace Arkan.Server.Interfaces
{
    public interface IAdminStatistics
    {
        Task<Statistics> GetStatistics();
        Task<InstructorStatistics> GetInstructorStatistics(string userId);
        Task<CourseStatistics> GetCourseStatistics(int courseId);
        Task<StudentsStatistics> GetStudentStatistics(string userId);
        Task<List<GetPendingOrders>> GetOrdersStatistics(DateTime FromDate, DateTime ToDate);
    }
}
