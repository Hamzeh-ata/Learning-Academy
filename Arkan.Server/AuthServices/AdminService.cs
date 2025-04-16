using Arkan.Server.BaseRepository;
using Arkan.Server.Data;
using Arkan.Server.Enums;
using Arkan.Server.LoggerFilter;
using Arkan.Server.Models;
using Arkan.Server.PageModels.AdminModels;
using Arkan.Server.RoleServices;
using Arkan.Server.StudentModels;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace Arkan.Server.AuthServices
{
    public class AdminService : IAdminService
    {
        private readonly UserManager<ApplicationUser> _UserManager;
        private readonly ApplicationDBContext _context;
        private readonly IRoles _Roles;
        private readonly IBaseRepository _IBaseRepository;
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly ILoggerService _ILoggerService;

        public AdminService(IRoles Roles, UserManager<ApplicationUser> UserManager, ApplicationDBContext context, IBaseRepository IBaseRepository, IWebHostEnvironment webHostEnvironment, ILoggerService loggerService)
        {
            _UserManager = UserManager;
            _context = context;
            _Roles = Roles;
            _IBaseRepository = IBaseRepository;
            _webHostEnvironment = webHostEnvironment;
            _ILoggerService = loggerService;
        }
        public async Task<List<AdminDto>> GetAllAdmins()
        {

            var AdminRole = await _Roles.FindRoleByName(Roles.Admin.ToString());

            var AdminRoleId = AdminRole.Id;

            var UserIdsWithRoles = await _context.UsersRoles
                                   .Where(Role => Role.RoleId == AdminRoleId)
                                   .Select(Role=>Role.UserId)
                                     .Distinct()
                                   .ToListAsync();

            var admins = await _context.Users
             .Where(u => UserIdsWithRoles.Contains(u.Id))
             .ToListAsync();

            var adminDtos = new List<AdminDto>();

            foreach (var admin in admins)
            {
                var roles = await _Roles.FindAdminRolesList(admin.Id);
                var adminDto = new AdminDto
                {
                    Id = admin.Id,
                    UserName = admin.UserName,
                    Email = admin.Email,
                    FirstName = admin.FirstName,
                    LastName = admin.LastName,
                    PhoneNumber = admin.PhoneNumber,
                    Image = admin.ProfileImage,
                    Roles = roles
                };
                adminDtos.Add(adminDto);
            }

            return adminDtos;
        }
        public async Task<GetAddedAdmin> AddAdmin(AddAdminVM model, string currentUserId)
        {
            var IsEmailExists = await _UserManager.FindByEmailAsync(model.Email) is not null;

            if (IsEmailExists)
            {
                return new GetAddedAdmin { Key = ResponseKeys.EmailExists.ToString() };
            }

            var user = new ApplicationUser
            {  
                UserName = model.Email,
                Email = model.Email,
                FirstName = model.FirstName,
                LastName = model.LastName,
                PhoneNumber = model.PhoneNumber,
            };

            if (model.Image != null)
            {
                string originalFileName = Path.GetFileNameWithoutExtension(model.Image.FileName);
                string fileExtension = Path.GetExtension(model.Image.FileName);
                string shortenedFileName = originalFileName[..Math.Min(10, originalFileName.Length)];
                string PhotoName = string.Concat(Guid.NewGuid().ToString("N").AsSpan(0, 8), shortenedFileName, fileExtension);

                var photoRoot = Path.Combine(_webHostEnvironment.WebRootPath, "images/admins", PhotoName);

                using (var fileStream = new FileStream(photoRoot, FileMode.Create))
                {
                    model.Image.CopyTo(fileStream);
                }

                user.ProfileImage = "/images/admins/" + PhotoName;
            }

            var Result = await _UserManager.CreateAsync(user, model.Password);

            if (!Result.Succeeded)
            {
                return new GetAddedAdmin { Key = Result.ToString() };
            }
            await _ILoggerService.AddLog(currentUserId, ActionTypes.Add.ToString(), ItemsType.Admin.ToString(), user.FirstName);

            await AssignUserRole(Roles.Admin.ToString(), user.Id);

            if (model.Roles != null)
            {

                var rolesToAdd = model.Roles.Select(role => role.RoleId).ToList();
                await AssignUserRoles(rolesToAdd, user.Id);
            }

            var roles = await _Roles.FindAdminRolesList(user.Id);

            
            return new GetAddedAdmin
            {
                Id = user.Id,
                UserName = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber,
                Image = user.ProfileImage,
                Roles = roles,
                Key = ResponseKeys.Success.ToString()
            };
               
        }
        public async Task<AdminProfileVM> GetAdminInfo(string UserId)
        {
            var model = new AdminProfileVM();
            var user = await _UserManager.FindByIdAsync(UserId);

            if (user is null)
            {
                model.Key = ResponseKeys.UserNotFound.ToString();
                return model;
            }

            var roles = await _Roles.FindAdminRolesList(user.Id);

            model.Image = user.ProfileImage;
            model.Id = user.Id;
            model.UserName = user.UserName;
            model.FirstName = user.FirstName;
            model.LastName = user.LastName;
            model.Email = user.Email;
            model.PhoneNumber = user.PhoneNumber;
            model.Key = ResponseKeys.Success.ToString();
            model.Roles = roles;
            return model;

        }
        public async Task<AdminProfileVM> UpdateAdminInfo(UpdateAdminProfileVM model,string currentUserId)
        {
            
            var user = await _UserManager.FindByIdAsync(model.Id);
            var UserProfileVM = new AdminProfileVM();
            if (user is null)
            {
                return new AdminProfileVM { Key = ResponseKeys.UserNotFound.ToString() };
            }

            var UserWithSameEmail = await _UserManager.FindByEmailAsync(model.Email);

            if (UserWithSameEmail is not null && UserWithSameEmail.Id != model.Id)
            {
                return new AdminProfileVM { Key = ResponseKeys.EmailExists.ToString() };
            }

            var UserWithSameUserName = await _UserManager.FindByNameAsync(model.UserName);

            if (UserWithSameUserName is not null && UserWithSameUserName.Id != model.Id)
            {
                return new AdminProfileVM { Key = ResponseKeys.EmailExists.ToString() };
            }



            if (model.Image != null && !(model.Image is string))
            {

                if (!string.IsNullOrEmpty(user.ProfileImage))
                {

                    var existingImagePath = Path.Combine(_webHostEnvironment.WebRootPath, user.ProfileImage.TrimStart('/'));

                    // Using statement ensures proper disposal of resources
                    using (var stream = System.IO.File.Open(existingImagePath, FileMode.Open, FileAccess.Write, FileShare.ReadWrite))
                    {

                    }

                    System.IO.File.Delete(existingImagePath);
                }

                string originalFileName = Path.GetFileNameWithoutExtension(model.Image.FileName);
                string fileExtension = Path.GetExtension(model.Image.FileName);
                string shortenedFileName = originalFileName[..Math.Min(10, originalFileName.Length)];
                string PhotoName = string.Concat(Guid.NewGuid().ToString("N").AsSpan(0, 8), shortenedFileName, fileExtension);

                var photoRoot = Path.Combine(_webHostEnvironment.WebRootPath, "images/admins", PhotoName);

                using (var fileStream = new FileStream(photoRoot, FileMode.Create))
                {
                    model.Image.CopyTo(fileStream);
                }
                user.ProfileImage = "/images/admins/" + PhotoName;

            }


            if (model.Roles != null)
            {

                var UserRoles = await _context.UsersRoles.Where(ur => ur.UserId == user.Id).ToListAsync();
                _context.UsersRoles.RemoveRange(UserRoles);
                await _context.SaveChangesAsync();

                var rolesToAdd = model.Roles.ToList();

                foreach (var role in rolesToAdd)
                {
                    var userRole = new UsersRoles { UserId = user.Id, RoleId = role.RoleId };
                    _context.UsersRoles.Add(userRole);
                }


                await _ILoggerService.AddLog(currentUserId, ActionTypes.Update.ToString(), ItemsType.Admin.ToString(), user.FirstName);

                await _context.SaveChangesAsync();
            }

            var roles = await _Roles.FindUserRolesList(user.Id);

            user.FirstName = model.FirstName;
            user.LastName = model.LastName;
            user.Email = model.Email;
            user.PhoneNumber = model.PhoneNumber;
            user.UserName = model.UserName;
            UserProfileVM.Id = user.Id;
            UserProfileVM.FirstName = user.FirstName;
            UserProfileVM.LastName = user.LastName;
            UserProfileVM.Email = user.Email;
            UserProfileVM.Image = user.ProfileImage;
            UserProfileVM.PhoneNumber = user.PhoneNumber;
            UserProfileVM.UserName = user.UserName;
            UserProfileVM.Roles = roles;
            UserProfileVM.Key = ResponseKeys.Success.ToString();


            await _UserManager.UpdateAsync(user);

            return UserProfileVM;

        }
        public async Task<string> DeleteAdmin(string UserId,string currentUserId)
        {
            var User = await  _UserManager.FindByIdAsync(UserId);

            if (User is null)
            {
                return ResponseKeys.UserNotFound.ToString();
            }

            await _ILoggerService.AddLog(currentUserId, ActionTypes.Update.ToString(), ItemsType.Admin.ToString(), User.FirstName);

            var result = await _UserManager.DeleteAsync(User);

            if (!result.Succeeded)
            {
                return  ResponseKeys.Failed.ToString();
            }

            if (!string.IsNullOrEmpty(User.ProfileImage))
            {

                var existingImagePath = Path.Combine(_webHostEnvironment.WebRootPath, User.ProfileImage.TrimStart('/'));

                using (var stream = System.IO.File.Open(existingImagePath, FileMode.Open, FileAccess.Write, FileShare.ReadWrite))
                {
                    
                }
                
                System.IO.File.Delete(existingImagePath);
            }


            return ResponseKeys.Success.ToString();
        }
        public async Task<string> ChangeAdminPassword(ChangePasswordAdminForm model, string currentUserId)
        {
            var user = await _UserManager.FindByIdAsync(model.UserId);

            if (user is null)
            {
                return ResponseKeys.UserNotFound.ToString();
            }

            var token = await _UserManager.GeneratePasswordResetTokenAsync(user);

            IdentityResult result = await _UserManager.ResetPasswordAsync(user, token, model.NewPassword);

            if (!result.Succeeded)
            {
                return ResponseKeys.Failed.ToString();
            }

            await _ILoggerService.AddLog(currentUserId, ActionTypes.ChangePassword.ToString(), ItemsType.Admin.ToString(), user.FirstName);


            return ResponseKeys.Success.ToString();

        }
        private async Task AssignUserRole(string role, string userId)
        {
            var Role = await _Roles.FindRoleByName(role);
            if (Role is not null)
            {
                var roleId = Role.Id;

                var UserRoleToAdd = new UsersRoles
                {
                    RoleId = roleId,
                    UserId = userId
                };
                _context.Add(UserRoleToAdd);
                await _context.SaveChangesAsync();
            }

        }
        private async Task AssignUserRoles(List<int> roleIds, string userId)
        {
            var userRolesToAdd = roleIds.Select(roleId => new UsersRoles
            {
                RoleId = roleId,
                UserId = userId
            });

             _IBaseRepository.AddRange(userRolesToAdd);
        }
    }
}
