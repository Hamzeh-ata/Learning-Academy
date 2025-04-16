using Arkan.Server.BaseRepository;
using Arkan.Server.Data;
using Arkan.Server.Enums;
using Arkan.Server.Helpers;
using Arkan.Server.Models;
using Arkan.Server.RoleServices;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Security.Cryptography;
using Arkan.Server.PageModels.AuthModels;
using Arkan.Server.Interfaces;
namespace Arkan.Server.AuthServices
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly ApplicationDBContext _context;
        private readonly IRoles _Roles;
        private readonly JWT _jwt;
        private readonly ISessions _IStudentSessions;
        public AuthService(IRoles Roles, UserManager<ApplicationUser> userManager , RoleManager<IdentityRole> RoleManager, IOptions<JWT> jwt, ApplicationDBContext context, ISessions IStudentSessions)
        {
            _userManager = userManager;
            _jwt = jwt.Value;
            _roleManager = RoleManager;
            _context = context;
            _Roles = Roles;
            _IStudentSessions = IStudentSessions;
        }
        public async Task<AuthModel> GetTokenAsync(TokenRequestModel model)
        {
            var authModel = new AuthModel();

            var user = await _userManager.FindByEmailAsync(model.Email);

            if (user is null || !await _userManager.CheckPasswordAsync(user, model.Password))
            {
                return new AuthModel { Key = ResponseKeys.InvalidCredentials.ToString() };
            }

            var jwtSecurityToken = await CreateJwtToken(user);

            var usersRoles = _context.Entry(user)
                    .Collection(u => u.UserRoles)
                    .Query()
                    .Include(ur => ur.Role)
                    .ToList();

            var rolesList = usersRoles.Select(ur => ur.Role.Name).ToList();
       
            var userSessionStatus = await _IStudentSessions.AddDeviceInfo(user.Id, rolesList);
                
            if (userSessionStatus != ResponseKeys.Success.ToString())
            {
                return new AuthModel { Key = userSessionStatus };
            }

            authModel.IsAuthenticated = true;
            authModel.Token = new JwtSecurityTokenHandler().WriteToken(jwtSecurityToken);
            authModel.Email = user.Email;
            authModel.FirstName = user.FirstName;
            authModel.LastName = user.LastName;
            authModel.UserName = user.UserName;
            authModel.Roles = rolesList; 

            if (user.RefreshTokens.Any(t => t.IsActive))
            {
                var activeRefreshToken = user.RefreshTokens.FirstOrDefault(t=>t.IsActive);
                authModel.RefreshToken = activeRefreshToken.Token;
                authModel.RefreshTokenExpiration = jwtSecurityToken.ValidTo;
            }

            else
            {
               var refreshToken = GenerateRefreshToken();
               authModel.RefreshToken = refreshToken.Token;
               authModel.RefreshTokenExpiration = jwtSecurityToken.ValidTo;
               user.RefreshTokens.Add(refreshToken);
               await _userManager.UpdateAsync(user);
            }

            return authModel;
        }

        public async Task<AuthModel> RegisterAsync(RegisterModel model)
        {
            if (await _userManager.FindByEmailAsync(model.Email) is not null)
            {
                return new AuthModel { Key = ResponseKeys.EmailExists.ToString() };
            }
            var user = new ApplicationUser
            {   UserName = model.Email,
                Email = model.Email,
                PhoneNumber = model.PhoneNumber,
                FirstName = model.FirstName,
                LastName = model.LastName,
            };

            var Result = await _userManager.CreateAsync(user, model.Password);

            if (!Result.Succeeded) {

                var errors = string.Empty;

                foreach (var error in Result.Errors)
                {
                    errors += $"{error.Description},";

                }

                return new AuthModel { Key = errors };


            }
            //await _userManager.AddToRoleAsync(user, model.Role);

            var entity = CreateAssociatedEntity(model.Role, user.Id); 

            if (entity != null)
            {
                _context.Add(entity);
                await _context.SaveChangesAsync();
                await AssignUserRole(model.Role, user.Id);
            }

            var jwtSecurityToken = await CreateJwtToken(user);

            return new AuthModel
            {
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                UserName = user.UserName,
                IsAuthenticated = true,
                RefreshTokenExpiration = jwtSecurityToken.ValidTo,
                Roles = new List<string> { model.Role },
                Token = new JwtSecurityTokenHandler().WriteToken(jwtSecurityToken),

            };
        }
        private async Task<JwtSecurityToken> CreateJwtToken(ApplicationUser user)
        {
            var userClaims = await _userManager.GetClaimsAsync(user);
            var roles = await _Roles.FindUserRolesNames(user.Id);
            var roleClaims = new List<Claim>();

            foreach(var role in roles)
            {
                roleClaims.Add(new Claim("roles", role));
            }

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.UserName),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim("uid", user.Id)
            }
            .Union(userClaims)
            .Union(roleClaims);

            var symmetricSecurityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwt.Key));
            var signingCredentials = new SigningCredentials(symmetricSecurityKey, SecurityAlgorithms.HmacSha256);

            var jwtSecurityToken = new JwtSecurityToken(
                issuer: _jwt.Issuer,
                audience: _jwt.Audience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(_jwt.DurationInMinutes),
                signingCredentials: signingCredentials);

            return jwtSecurityToken;
    }
        public async Task<string> AddRoleAsync(AddUserRolesModel model)
        {
            var user = await _userManager.FindByIdAsync(model.UserId);

            if (user is null || !await _roleManager.RoleExistsAsync(model.Role))
                return "Invalid user ID or Role";

            if (await _userManager.IsInRoleAsync(user, model.Role))
                return "User already assigned to this role";

            var result = await _userManager.AddToRoleAsync(user, model.Role);

            return result.Succeeded ? string.Empty : "Sonething went wrong";
        }
        private object CreateAssociatedEntity(string role, string userId)
        {
            switch (role)
            {
                case "Student":
                    return new Student
                    {
                        UserId = userId,
                    };
                case "Instructor":
                    return new Instructor
                    {
                        UserId = userId,
                    };

                default:
                    return null; // No associated entity for this role
            }
        }
        private async Task AssignUserRole(string role,string userId)
        {
            var Role = await _Roles.FindRoleByName(role);
            if(Role is not null)
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
        private RefreshToken GenerateRefreshToken()
        {
            var randomNumber = new byte[32];
            using var generator = new RNGCryptoServiceProvider();

            generator.GetBytes(randomNumber);
            return new RefreshToken
            {
                Token = Convert.ToBase64String(randomNumber),
                ExpiresOn = DateTime.UtcNow.AddDays(10),
                CreatedOn = DateTime.UtcNow,
            };

        }
        public async Task<AuthModel> RefreshTokenAsync(string token)
        {
            var authModel = new AuthModel();
            var user = await _userManager.Users.SingleOrDefaultAsync(u => u.RefreshTokens.Any(t => t.Token == token));
            if(user is null)
            {
                authModel.IsAuthenticated = false;
                authModel.Key = ResponseKeys.InvalidToken.ToString();
                return authModel;
            }

            var refreshToken = user.RefreshTokens.Single(t=>t.Token == token);

            if (!refreshToken.IsActive)
            {
                authModel.IsAuthenticated = false;
                authModel.Key = ResponseKeys.InactiveToken.ToString();
                return authModel;
            }

            refreshToken.RevokedOn = DateTime.UtcNow;

            var newRefreshToken = GenerateRefreshToken();
            user.RefreshTokens.Add(newRefreshToken);
            await _userManager.UpdateAsync(user);

            var jwtToken = await CreateJwtToken(user);

            var usersRoles = _context.Entry(user)
           .Collection(u => u.UserRoles)
           .Query()
           .Include(ur => ur.Role)
           .ToList();

            var rolesList = usersRoles.Select(ur => ur.Role.Name).ToList();
            authModel.IsAuthenticated = true;
            authModel.Token = new JwtSecurityTokenHandler().WriteToken(jwtToken);
            authModel.Email = user.Email;
            authModel.UserName = user.UserName;
            authModel.Roles = rolesList;
            authModel.RefreshToken = newRefreshToken.Token;
            authModel.RefreshTokenExpiration = newRefreshToken.ExpiresOn;
            return authModel;
        }
        public async Task<bool> RevokeTokenAsync(string token)
        {
            var user = await _userManager.Users.SingleOrDefaultAsync(u => u.RefreshTokens.Any(t => t.Token == token));
            if (user is null)
            {
                return false;
            }

            var refreshToken = user.RefreshTokens.Single(t => t.Token == token);

            if (!refreshToken.IsActive)
            {
                return false;
            }

            refreshToken.RevokedOn = DateTime.UtcNow;

      
            await _userManager.UpdateAsync(user);

            return true;
        }



    }
}