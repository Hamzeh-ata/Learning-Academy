using Arkan.Server.BaseRepository;
using Arkan.Server.Client_Interfaces;
using Arkan.Server.Data;
using Arkan.Server.Enums;
using Arkan.Server.Models;
using Arkan.Server.StudentModels;
using Microsoft.AspNetCore.Identity;

namespace Arkan.Server.Client_Repositories
{
    public class UserPasswordRepository: IUserPassword
    {
        private readonly UserManager<ApplicationUser> _userManager;

        public UserPasswordRepository(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }

        public async Task<string> ChangePassword(string newPassword,string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user is null)
            {
                return ResponseKeys.UserNotFound.ToString();
            }
            var token = await _userManager.GeneratePasswordResetTokenAsync(user);

            IdentityResult result = await _userManager.ResetPasswordAsync(user, token, newPassword);

            if (!result.Succeeded)
            {
                return ResponseKeys.Failed.ToString();
            }
            return ResponseKeys.Success.ToString();
        }
    }
}
