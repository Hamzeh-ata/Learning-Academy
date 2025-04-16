using Arkan.Server.BaseRepository;
using Arkan.Server.Client_Interfaces;
using Arkan.Server.Client_PageModels.LiveSessions;
using Arkan.Server.Data;
using Arkan.Server.Enums;
using Arkan.Server.Models;
using Arkan.Server.Notifications;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System.Globalization;

namespace Arkan.Server.Client_Repositories
{
    public class LiveSessionsRepository : ILiveSession
    {
        private readonly ApplicationDBContext _context;
        private readonly IBaseRepository _IBaseRepository;
        private readonly INotificationService _NotificationService;
        private readonly UserManager<ApplicationUser> _userManager;
        public LiveSessionsRepository(ApplicationDBContext context, IBaseRepository IBaseRepository, INotificationService NotificationService, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _IBaseRepository = IBaseRepository;
            _NotificationService = NotificationService;
            _userManager = userManager;

        }
        public async Task<GetLive> Add(LiveDto model, string userId)
        {
            var instructorId = await _IBaseRepository.GetInstructorIdByUserID(userId);

            var live = new LiveSession
            {
                InstructorId = instructorId,
                Description = model.Description.Trim(),
                CourseId = model.CourseId,
                Title = model.Title.Trim(),
                StartDate = model.StartTime,
                EndDate = model.EndTime,
                Status = model.Status,
                UsersCount = model.UsersCount,
                IsStarted = model.IsStarted,
            };

            await _IBaseRepository.AddAsync<LiveSession>(live);

            var courseEnrollments = await _context.Enrollments.Where(e => e.CourseId == model.CourseId)
                .Select(e => new GetLiveStudents
                {
                    Id = e.StudentId,
                    UserName = e.Student.User.FirstName + " " + e.Student.User.LastName,
                }).ToListAsync();

            var instructorUser = await _userManager.FindByIdAsync(userId);

            var course = await _context.Courses.Where(c => c.Id == model.CourseId).FirstOrDefaultAsync();

            return new GetLive
            {
                Id = live.Id,
                Title = live.Title,
                Description = live.Description,
                InstructorId = live.InstructorId,
                InstructorUserId = userId,
                InstructorName = instructorUser.FirstName + " " + instructorUser.LastName,
                CourseId = live.CourseId,
                StartTime = live.StartDate,
                EndTime = live.EndDate,
                CourseName = course.Name,
                Students = courseEnrollments,
                Status = live.Status,
                UsersCount = live.UsersCount,
                IsOwner = true,
                CourseImage = course.Image,
                Key = ResponseKeys.Success.ToString()
            };
        }
        public async Task<GetLive> Update(LiveDto model, string userId)
        {
            var instructorId = await _IBaseRepository.GetInstructorIdByUserID(userId);

            var live = await _context.LiveSessions.Where(ls => ls.Id == model.Id)
                .FirstOrDefaultAsync();

            if (live is null)
            {
                return new GetLive
                {
                    Key = ResponseKeys.NotFound.ToString(),
                };
            }

            if (instructorId != live.InstructorId)
            {
                return new GetLive
                {
                    Key = ResponseKeys.UnauthorizedAccess.ToString(),
                };
            }

            var courseEnrollments = await _context.Enrollments.Where(e => e.CourseId == model.CourseId)
                .Select(e => new GetLiveStudents
                {
                    Id = e.StudentId,
                    UserName = e.Student.User.FirstName + " " + e.Student.User.LastName,
                }).ToListAsync();

            var instructorUser = await _userManager.FindByIdAsync(userId);

            var course = await _context.Courses.Where(c => c.Id == model.CourseId).FirstOrDefaultAsync();

            live.Title = model.Title.Trim();
            live.Description = model.Description.Trim();
            live.Status = model.Status;
            live.UsersCount = model.UsersCount;
            live.StartDate = model.StartTime;
            live.EndDate = model.EndTime;
            live.IsStarted = model.IsStarted;

            _IBaseRepository.Update<LiveSession>(live);

            return new GetLive
            {
                Id = live.Id,
                Title = live.Title,
                Description = live.Description,
                InstructorId = live.InstructorId,
                InstructorUserId = userId,
                InstructorName = instructorUser.FirstName + " " + instructorUser.LastName,
                CourseId = live.CourseId,
                StartTime = live.StartDate,
                EndTime = live.EndDate,
                CourseName = course.Name,
                CourseImage = course.Image,
                Students = courseEnrollments,
                IsOwner = true,
                Status = live.Status,
                UsersCount = live.UsersCount,
                MeetingId = live.MeetingId,
                Key = ResponseKeys.Success.ToString(),
            };
        }
        public async Task<string> Delete(int id, string userId)
        {
            var live = await _context.LiveSessions.Where(ls => ls.Id == id)
               .FirstOrDefaultAsync();

            if (live is null)
            {
                return ResponseKeys.NotFound.ToString();
            }

            var instructorId = await _IBaseRepository.GetInstructorIdByUserID(userId);

            if (instructorId != live.InstructorId)
            {
                return ResponseKeys.UnauthorizedAccess.ToString();
            }

            var isRemoved = _IBaseRepository.Remove<LiveSession>(live);

            if (!isRemoved)
            {
                return ResponseKeys.Failed.ToString();
            }

            return ResponseKeys.Success.ToString();

        }
        public async Task<List<GetLive>> GetUserLives(string userId)
        {
            var userRole = await _IBaseRepository.FindUserRole(userId);

            if (userRole == Roles.Student.ToString())
            {
                var studentId = await _IBaseRepository.GetStudentIdByUserId(userId);

                var studentCourses = await _context.Enrollments
                    .Where(e => e.StudentId == studentId)
                    .Select(e => e.CourseId)
                    .ToListAsync();

                var studentLives = await _context.LiveSessions
                    .Where(live => studentCourses.Contains(live.CourseId))
                    .Select(live => new GetLive
                    {
                        Id = live.Id,
                        Title = live.Title,
                        Description = live.Description,
                        InstructorId = live.InstructorId,
                        InstructorUserId = live.instructor.UserId,
                        InstructorName = live.instructor.User.FirstName + " " + live.instructor.User.LastName,
                        CourseId = live.CourseId,
                        StartTime = live.StartDate,
                        EndTime = live.EndDate,
                        CourseName = live.Course.Name,
                        CourseImage = live.Course.Image,
                        IsStarted = live.IsStarted,
                        IsOwner = false,
                        Status = live.Status,
                        MeetingId = live.MeetingId,
                    })
                    .ToListAsync();

                return studentLives;
            }
            else if (userRole == Roles.Instructor.ToString())
            {
                var instructorId = await _IBaseRepository.GetInstructorIdByUserID(userId);

                var instructorLives = await _context.LiveSessions
                    .Where(live => live.InstructorId == instructorId)
                    .Select(live => new GetLive
                    {
                        Id = live.Id,
                        Title = live.Title,
                        Description = live.Description,
                        InstructorId = live.InstructorId,
                        InstructorUserId = live.instructor.UserId,
                        InstructorName = live.instructor.User.FirstName + " " + live.instructor.User.LastName,
                        CourseId = live.CourseId,
                        StartTime = live.StartDate,
                        EndTime = live.EndDate,
                        CourseName = live.Course.Name,
                        Status = live.Status,
                        UsersCount = live.UsersCount,
                        CourseImage = live.Course.Image,
                        IsOwner = live.instructor.UserId == userId,
                        MeetingId = live.MeetingId,
                        IsStarted = live.IsStarted,
                        Students = new List<GetLiveStudents>()
                    })
                    .ToListAsync();

                var liveCourseIds = instructorLives.Select(il => il.CourseId).ToList();

                var courseEnrollments = await _context.Enrollments
                    .Where(e => liveCourseIds.Contains(e.CourseId))
                    .Select(e => new
                    {
                        e.CourseId,
                        Student = new GetLiveStudents
                        {
                            Id = e.StudentId,
                            UserName = e.Student.User.FirstName + " " + e.Student.User.LastName
                        }
                    })
                    .ToListAsync();

                foreach (var live in instructorLives)
                {
                    live.Students = courseEnrollments
                        .Where(e => e.CourseId == live.CourseId)
                        .Select(e => e.Student)
                        .ToList();
                }

                return instructorLives;
            }

            return new List<GetLive>();
        }
        public async Task<string> ToggleLive(int liveId, string meetingId, LiveSessionStatus status , bool notifyUsers, string userId)
        {
            var live = await _context.LiveSessions.Where(l => l.Id == liveId)
                .FirstOrDefaultAsync();

            if (live == null)
            {
                return ResponseKeys.NotFound.ToString();
            }

            var instructorId = await _IBaseRepository.GetInstructorIdByUserID(userId);

            if (instructorId != live.InstructorId)
            {
                return ResponseKeys.UnauthorizedAccess.ToString();
            }

            if (notifyUsers)
            {

                var studentsUserId = await _context.Enrollments.Where(e => e.CourseId == live.CourseId)
                    .Select(e => e.Student.UserId)
                    .ToListAsync();

                if (studentsUserId.Any())
                {
                    foreach (var student in studentsUserId)
                    {
                        await _NotificationService.Notify("client", $"{live.Title} has been started", student);
                    }
                }
            }

                live.MeetingId = meetingId;
                live.Status = status;
                live.IsStarted = status == LiveSessionStatus.Started;
                _IBaseRepository.Update<LiveSession>(live);
            
            return ResponseKeys.Success.ToString();
        }
        public async Task<GetLive> GetLiveById(int liveId, string userId)
        {
            var live = await _context.LiveSessions.Where(ls => ls.Id == liveId)
               .FirstOrDefaultAsync();

            if (live is null)
            {
                return new GetLive
                {
                    Key = ResponseKeys.NotFound.ToString(),
                };
            }

            var userRole = await _IBaseRepository.FindUserRole(userId);

            if (userRole == Roles.Student.ToString())
            {
                var studentId = await _IBaseRepository.GetStudentIdByUserId(userId);

                var isStudentEnrolled = await _context.Enrollments
               .AnyAsync(e => e.CourseId == live.CourseId && e.StudentId == studentId);

                if (!isStudentEnrolled)
                {
                    return new GetLive
                    {
                        Key = ResponseKeys.UnauthorizedAccess.ToString()
                    };
                }

                return new GetLive
                {
                    Id = live.Id,
                    Title = live.Title,
                    Description = live.Description,
                    InstructorId = live.InstructorId,
                    InstructorUserId = userId,
                    InstructorName = live.instructor.User.FirstName + " " + live.instructor.User.LastName,
                    CourseId = live.CourseId,
                    StartTime = live.StartDate,
                    EndTime = live.EndDate,
                    CourseName = live.Course.Name,
                    IsOwner = false,
                    Status = live.Status,
                    UsersCount = live.UsersCount,
                    MeetingId = live.MeetingId,
                    Key = ResponseKeys.Success.ToString()
                };
            }

            var instructorId = await _IBaseRepository.GetInstructorIdByUserID(userId);

            if (live.InstructorId != instructorId)
            {
                return new GetLive
                {
                    Key = ResponseKeys.UnauthorizedAccess.ToString()
                };
            }

            var courseEnrollments = await _context.Enrollments.Where(e => e.CourseId == live.CourseId)
            .Select(e => new GetLiveStudents
            {
                Id = e.StudentId,
                UserName = e.Student.User.FirstName + " " + e.Student.User.LastName,
            }).ToListAsync();

            var instructorUser = await _userManager.FindByIdAsync(userId);

            var course = await _context.Courses.Where(c => c.Id == live.CourseId).FirstOrDefaultAsync();

            return new GetLive
            {
                Id = live.Id,
                Title = live.Title,
                Description = live.Description,
                InstructorId = live.InstructorId,
                InstructorUserId = userId,
                InstructorName = instructorUser.FirstName + " " + instructorUser.LastName,
                CourseId = live.CourseId,
                StartTime = live.StartDate,
                EndTime = live.EndDate,
                CourseName = course.Name,
                CourseImage = course.Image,
                Students = courseEnrollments,
                Status = live.Status,
                IsOwner = live.instructor.UserId == userId,
                UsersCount = live.UsersCount,
                IsStarted = live.IsStarted,
                MeetingId = live.MeetingId,
                Key = ResponseKeys.Success.ToString()
            };
        }
    }
}
