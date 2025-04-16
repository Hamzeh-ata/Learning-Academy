using Arkan.Server.AuthServices;
using Arkan.Server.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Arkan.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminStatisticsController : ControllerBase
    {
        private readonly IAdminStatistics _IAdminStatisticsService;
        public AdminStatisticsController(IAdminStatistics IAdminStatisticsService)
        {
            _IAdminStatisticsService = IAdminStatisticsService;
        }


        [HttpGet("")]
        public async Task<IActionResult> GetStatistics()
        {
            var result = await _IAdminStatisticsService.GetStatistics();

            return Ok(result);
        }
        [HttpGet("CourseStatistics")]
        public async Task<IActionResult> GetCourseStatistics(int courseId)
        {
            var result = await _IAdminStatisticsService.GetCourseStatistics(courseId);

            return Ok(result);
        }
        [HttpGet("InstructorStatistics")]
        public async Task<IActionResult> GetInstructorStatistics(string userId)
        {
            var result = await _IAdminStatisticsService.GetInstructorStatistics(userId);

            return Ok(result);
        }
        [HttpGet("StudentStatistics")]
        public async Task<IActionResult> GetStudentStatistics(string userId)
        {
            var result = await _IAdminStatisticsService.GetStudentStatistics(userId);

            return Ok(result);
        }
        [HttpGet("OrdersStatistics")]
        public async Task<IActionResult> GetOrdersStatistics(DateTime FromDate = default, DateTime ToDate = default)
        {
           
            var result = await _IAdminStatisticsService.GetOrdersStatistics(FromDate, ToDate);

            return Ok(result);
        }

    }
}
