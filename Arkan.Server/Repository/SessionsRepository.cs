using Arkan.Server.Data;
using DeviceDetectorNET.Parser.Client;
using DeviceDetectorNET.Parser;
using DeviceDetectorNET;
using Microsoft.EntityFrameworkCore;
using Arkan.Server.Enums;
using Arkan.Server.Models;
using Arkan.Server.BaseRepository;
using Arkan.Server.Interfaces;
using Arkan.Server.PageModels.StudentSessions;
using DeviceDetectorNET.Parser.Device;
using System.Net;
using System;

namespace Arkan.Server.Repository
{
    public class SessionsRepository : ISessions
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly ApplicationDBContext _context;
        private readonly IBaseRepository _IBaseRepository;

        public SessionsRepository(IHttpContextAccessor httpContextAccessor, ApplicationDBContext context, IBaseRepository IBaseRepository)
        {
            _httpContextAccessor = httpContextAccessor;
            _context = context;
            _IBaseRepository = IBaseRepository;
        }

        public async Task<string> AddDeviceInfo(string userId,List<string> userRoles)
        {
            var userAgent = _httpContextAccessor.HttpContext.Request.Headers["User-Agent"].ToString();

            var ipAddress = _httpContextAccessor.HttpContext.Connection.RemoteIpAddress?.ToString();

            DeviceDetector detector = new DeviceDetector(userAgent);
            detector.Parse();

            OperatingSystemParser operatingSystemParser = new OperatingSystemParser();
            BrowserParser browserParser = new BrowserParser();
            var osInfo = detector.GetOs();

            string operatingSystem = GetSystemInfoName(detector.GetOs().ToString());
            string browser = GetSystemInfoName(detector.GetClient().ToString());
            string deviceType = detector.GetDeviceName();

            if (!userRoles.Contains(Roles.Student.ToString()))
            {
                var oneMonthAgo = DateTime.UtcNow.AddMonths(-1);

                var inactiveSessions = await _context.Sessions
                 .Where(ss => ss.LastLoggedTime <= oneMonthAgo)
                 .ToListAsync();

                if (inactiveSessions.Any())
                {
                    _IBaseRepository.RemoveRange<Sessions>(inactiveSessions);
                }
            }
            // Check if the device already exists in the database

            var existingDevice = await _context.Sessions
            .FirstOrDefaultAsync(s => s.IPaddress == ipAddress
             && s.UserId == userId
             );

            if (existingDevice is not null)
            {
                existingDevice.LastLoggedTime = _IBaseRepository.GetJordanTime();

                existingDevice.Status = SessionStatus.Active;

                _IBaseRepository.Update<Sessions>(existingDevice);

                return ResponseKeys.Success.ToString();
            }

            var userDevicesCount = await _context.Sessions
                .CountAsync(ss => ss.UserId == userId);

            if (existingDevice == null && userDevicesCount >= 2 && userRoles.Contains(Roles.Student.ToString()))
            {
                return "You have exceeded the maximum number of allowed devices.";
            }


            Roles role;

            if (userRoles.Contains(Roles.Admin.ToString()))
            {

                role = Roles.Admin;
            }
            else if (userRoles.Contains(Roles.Student.ToString())) 
            {
                role = Roles.Student;

            }
            else {

                role = Roles.Instructor;

            }

            var newSession = new Sessions
            {
                OperatingSystem = operatingSystem,
                Browser = browser,
                DeviceType = deviceType,
                IPaddress = ipAddress,
                UserId = userId,
                LastLoggedTime = _IBaseRepository.GetJordanTime(),
                FirstLoggedTime = _IBaseRepository.GetJordanTime(),
                Status = SessionStatus.Active,
                Role = role,
            };

            await _IBaseRepository.AddAsync<Sessions>(newSession);

            return ResponseKeys.Success.ToString();
        }
        public async Task<List<GetUserSessions>> GetSessions(string userId)
        {
            return await _context.Sessions
                .Include(uc => uc.User)
                .Where(ss => ss.UserId == userId)
                .Select(ss => new GetUserSessions
                {
                    Id = ss.Id,
                    FirstName = ss.User.FirstName,
                    LastName = ss.User.LastName,
                    Email = ss.User.Email,
                    Image = ss.User.ProfileImage,
                    UserId = ss.UserId,
                    DeviceType = ss.DeviceType,
                    Browser = ss.Browser,
                    OperatingSystem = ss.OperatingSystem,
                    IPaddress = ss.IPaddress,
                    FirstLoggedTime = ss.FirstLoggedTime,
                    LastLoggedTime = ss.LastLoggedTime,
                    Status = ss.Status,
                    Role = ss.Role,
                })
                .ToListAsync();

        }
        public async Task<List<GetUserSessions>> GetActiveSessions()
        {
            return await _context.Sessions
                .Where(ss => ss.Status == SessionStatus.Active)
                .Include(uc => uc.User)
                .Select(ss => new GetUserSessions
                {
                    Id = ss.Id,
                    FirstName = ss.User.FirstName,
                    LastName = ss.User.LastName,
                    Email = ss.User.Email,
                    Image = ss.User.ProfileImage,
                    UserId = ss.UserId,
                    DeviceType = ss.DeviceType,
                    Browser = ss.Browser,
                    OperatingSystem = ss.OperatingSystem,
                    IPaddress = ss.IPaddress,
                    FirstLoggedTime = ss.FirstLoggedTime,
                    LastLoggedTime = ss.LastLoggedTime,
                    Status = ss.Status,
                    Role = ss.Role,
                })
                .ToListAsync();
        }
        public async Task<string> UpdateSessionStatus(string userId)
        {
            var ipAddress = _httpContextAccessor.HttpContext.Connection.RemoteIpAddress?.ToString();
            var existingDevice = await _context.Sessions
            .FirstOrDefaultAsync(s => s.IPaddress == ipAddress
             && s.UserId == userId
             );

            if (existingDevice is null ) {

                return ResponseKeys.Failed.ToString();
            }

            existingDevice.Status = SessionStatus.Inactive;

            _IBaseRepository.Update<Sessions>(existingDevice);

            return ResponseKeys.Success.ToString();
        }
        public async Task<string> DeleteSession(int id)
        {
            var session = await _context.Sessions
                .Where(ss => ss.Id == id)
                .FirstOrDefaultAsync();

            if(session is null)
            {
                return ResponseKeys.NotFound.ToString();
            }

            _IBaseRepository.Remove<Sessions>(session);

            return ResponseKeys.Success.ToString();
        }
        private string GetSystemInfoName(string operatingSystemInfo)
        {
            string[] parts = operatingSystemInfo.Split(';');
            string operatingSystemName = parts[1].Trim().Split(':')[1];
            return operatingSystemName;
        }
    }
}
