using Arkan.Server.BaseRepository;
using Arkan.Server.Data;
using Arkan.Server.Enums;
using Arkan.Server.Interfaces;
using Arkan.Server.Models;
using Arkan.Server.Notifications;
using Arkan.Server.PageModels.ChangePasswordRequests;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Arkan.Server.Repository
{
    public class ForgotPasswordRepository : IForgotPassword
    {
        private readonly ApplicationDBContext _context;
        private readonly IBaseRepository _IBaseRepository;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly INotificationService _NotificationService;
        public ForgotPasswordRepository(ApplicationDBContext context, IBaseRepository IBaseRepository, UserManager<ApplicationUser> userManager, INotificationService NotificationService)
        {
            _context = context;
            _IBaseRepository = IBaseRepository;
            _userManager = userManager;
            _NotificationService = NotificationService;
        }
        public async Task<ForgotPasswordModel> ForgotPasswordRequest(string email, string newPassword)
        {
            var user = await _userManager.FindByEmailAsync(email);

            if (user == null)
            {
                return new ForgotPasswordModel { Key = "Email not found" };
            }

            var requestedBefore = await _context.ForgotPasswordRequests
                .AnyAsync(fpr => fpr.UserId == user.Id);

            if (requestedBefore)
            {
                return new ForgotPasswordModel { Key = "Password change request already made" };
            }

            var forgotPasswordModel = new ForgotPasswordModel();

            var ForgotPasswordRequest = new ForgotPasswordRequests
            {
                UserId = user.Id,
                Password = newPassword.Trim(),
                RequestDate = _IBaseRepository.GetJordanTime()
            };

            await _IBaseRepository.AddAsync<ForgotPasswordRequests>(ForgotPasswordRequest);

            string notificationMessage = "New change password request received";

            await _NotificationService.NotifyAdmin("admin", notificationMessage, AdminNotifications.ChangePasswordRequests);

            forgotPasswordModel.FirstName = user.FirstName;
            forgotPasswordModel.LastName = user.LastName;
            forgotPasswordModel.Key = ResponseKeys.Success.ToString();

            return forgotPasswordModel;
        }
        public async Task<List<ChangePasswordRequests>> GetChangePasswordRequests()
       {
            var requests = await _context.ForgotPasswordRequests
                .Select(fpr => new ChangePasswordRequests
                {
                    Id = fpr.Id,
                    Email = fpr.User.Email,
                    UserName = fpr.User.FirstName +" "+ fpr.User.LastName,
                    PhoneNumber = fpr.User.PhoneNumber,
                    Password = fpr.Password,
                    Date = fpr.RequestDate.ToShortDateString(),
                }).ToListAsync();

            return requests;
       }
        public async Task<string> ConfirmRequest(int id)
        {
            var request = await _IBaseRepository.FindByIdAsync<ForgotPasswordRequests>(id);

            if (request == null)
            {
                return ResponseKeys.NotFound.ToString();
            }

            var user = await _userManager.FindByIdAsync(request.UserId);

            if (user == null)
            {
                return ResponseKeys.UserNotFound.ToString();
            }

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);

            IdentityResult result = await _userManager.ResetPasswordAsync(user, token, request.Password);

            if (!result.Succeeded)
            {
                return ResponseKeys.Failed.ToString();
            }

            var deleted = await DeleteRequest(id);

            return deleted;
        }
        public async Task<string> DeleteRequest(int Id)
        {
            var request = await _context.ForgotPasswordRequests
                .Where(fpr => fpr.Id ==Id)
                .FirstOrDefaultAsync();

            if(request == null)
            {
                return ResponseKeys.NotFound.ToString();
            }

            _IBaseRepository.Remove<ForgotPasswordRequests>(request);

            return ResponseKeys.Success.ToString();
        }

    }
}
