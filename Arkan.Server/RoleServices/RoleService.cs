using Arkan.Server.BaseRepository;
using Arkan.Server.Data;
using Arkan.Server.Enums;
using Arkan.Server.Models;
using Arkan.Server.PageModels.RolesModels;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Data;
using System.Security.Claims;
using System.Xml.Linq;

namespace Arkan.Server.RoleServices
{
    public class RoleService : IRoles
    {
        private readonly ApplicationDBContext _context;
        private readonly IBaseRepository _IBaseRepository;
        private readonly UserManager<ApplicationUser> _UserManager;
        public RoleService(UserManager<ApplicationUser> UserManager, ApplicationDBContext context, IBaseRepository IBaseRepository)
        {
            _UserManager= UserManager;
            _context = context;
            _IBaseRepository = IBaseRepository;
        }
        public async Task<UserRolesModel> GetAdminRoles(string UserId)
        {
            var UserRolesModel = new UserRolesModel();

            var User = await _UserManager.FindByIdAsync(UserId);

            if (User is null)
            {
                UserRolesModel.Key = ResponseKeys.UserNotFound.ToString();
                return UserRolesModel;
            }

            var Roles = await _context.Role.ToListAsync();

            if( Roles is null)
            {
                UserRolesModel.Key = ResponseKeys.EmptyRoles.ToString();
                return UserRolesModel;
            }


            var UserRoles = await _context.UsersRoles.Where(ur => ur.UserId == UserId).ToListAsync();

            var ReturnedData = new UserRolesModel
            {
                UserID = User.Id,

                Email = User.Email,

                Roles = Roles.Select(roles => new RoleDTO
                {
                    RoleId = roles.Id,
                    RoleName = roles.Name,
                    IsSelected = UserRoles.Any(ur => ur.RoleId == roles.Id)
                }).ToList(),

                Key = ResponseKeys.Success.ToString()
            };
            return ReturnedData;



        }
        public async Task<UpdatedAdminRole> UpdateAdminRoles(ManageAdminRolesModel model)
        {
            var user = await _UserManager.FindByIdAsync(model.UserID);

            if (user is null)
            {
                return new UpdatedAdminRole { Key = ResponseKeys.UserNotFound.ToString() };
            }

            var UserRoles = await _context.UsersRoles.Where(ur => ur.UserId == user.Id).ToListAsync();

            _context.RemoveRange(UserRoles);


            var selectedRoles = model.Roles.ToList();

            foreach (var role in selectedRoles)
            {
                if (role != null)
                {
                    var userRoles = new UsersRoles { UserId = user.Id, RoleId = role.RoleId };
                    await _IBaseRepository.AddAsync(userRoles);
                }
            }

            return new UpdatedAdminRole
            {
                UserID = user.Id,
                Roles = user.UserRoles.Select(Role=>Role.RoleId).ToList(),
                Key = ResponseKeys.Success.ToString()
            };
        }
        public async Task<RolesModelDto> GetAllRoles()
        {
            Dictionary<int, int> roleUserCounts = await GetRoleUserCounts();

            var roles = await  _context.Role
                .Where(r => r.Name != Roles.Instructor.ToString() && r.Name != Roles.Admin.ToString() && r.Name != Roles.Student.ToString())
                .Select(Role => new RolesModel
                {
                    Id = Role.Id,
                    Name = Role.Name,
                    Description = Role.Description,
                    UsersCount = roleUserCounts.ContainsKey(Role.Id) ? roleUserCounts[Role.Id] : 0
                }).ToListAsync();

            return new RolesModelDto
            {
                RolesModel = roles,
                Key = ResponseKeys.Success.ToString()
            };

        }
        public async Task<AddedRoleModel> AddRole(AddRoleModel model)
        {
            var IsNameExists = await _context.Role.AnyAsync(Role => Role.Name == model.Name);

            if (IsNameExists)
            {
                return new AddedRoleModel { Key = ResponseKeys.NameExists.ToString() };
            }

            if (model.Name.Trim().ToLower() == Roles.Instructor.ToString().ToLower() ||
                model.Name.Trim().ToLower() == Roles.Admin.ToString().ToLower() || 
                model.Name.Trim().ToLower() == Roles.Student.ToString().ToLower())
            {
                return new AddedRoleModel { Key = ResponseKeys.ReservedRole.ToString() };

            }

            var role = new Role
            {
                Name = model.Name.Trim(),
                Description = model.Description,
            };

            var isRoleAdded = await _IBaseRepository.AddAsync(role);

            if (!isRoleAdded) {
                return new AddedRoleModel { Key = ResponseKeys.Failed.ToString() };
            }

            return new AddedRoleModel
            {
                Id = role.Id,
                Name = role.Name,
                Description = role.Description,
                UsersCount = 0,
                Key = ResponseKeys.Success.ToString()
            };

        }
        public async Task<UpdateRolesModel> UpdateRole(UpdateRoleModel model)
        {
            var roleModel = new UpdateRolesModel();
            var IsRoleExists = await _context.Role.AnyAsync(role => role.Id == model.Id);
            if (!IsRoleExists)
            {
                roleModel.Key = ResponseKeys.Success.ToString();
                return roleModel;
            }

            var IsRoleNameExists = await _context.Role.AnyAsync(role => role.Name == model.Name && role.Id != model.Id);
            if(IsRoleNameExists)
            {
                roleModel.Key = ResponseKeys.NameExists.ToString();
                return roleModel;
            }

            var role = await _context.Role.Where(role=>role.Id == model.Id).SingleOrDefaultAsync();

            role.Name = model.Name;

            role.Description = model.Description;

            _IBaseRepository.Update(role);

            Dictionary<int, int> roleUserCounts = await GetRoleUserCounts();

            roleModel.Id = role.Id;
            roleModel.Name = role.Name;
            roleModel.Description = role.Description;
            roleModel.UsersCount = roleUserCounts.ContainsKey(role.Id) ? roleUserCounts[role.Id] : 0;
            roleModel.Key = ResponseKeys.Success.ToString();

            return roleModel;
        }
        public async Task<Role> FindRoleById(int id)
        {
            var Role = await _context.Role.Where(Role => Role.Id == id).SingleOrDefaultAsync();
            return Role;
        }
        public async Task<string> DeleteRole(int RoleId)
        {
            var Role = await _context.Role.Where(Role => Role.Id == RoleId).SingleOrDefaultAsync();

            if (Role is null)

            {
                return ResponseKeys.RoleNotFound.ToString();
            }

            _IBaseRepository.Remove(Role);

            return ResponseKeys.Success.ToString();
        }
        public async Task<Role> FindRoleByName(string Name)
        {
            var Role = await _context.Role.Where(Role=>Role.Name == Name).SingleOrDefaultAsync();
            return Role;
        }
        public async Task<List<Dictionary<string, object>>> FindUserRolesList(string UserId)
        {
            var userRoles = _context.UsersRoles
                .Where(ur => ur.UserId == UserId)
                .Select(ur => new { Id = ur.RoleId, Name = ur.Role.Name })
                .ToList();

            var rolesList = userRoles.Select(ur => new Dictionary<string, object>
            {
                { "id", ur.Id },
                { "name", ur.Name }
            }).ToList();

            return rolesList;
        }

        public async Task<List<Dictionary<string, object>>> FindAdminRolesList(string UserId)
        {
            var userRoles = _context.UsersRoles
              .Where(ur => ur.UserId == UserId && ur.Role.Name != Roles.Admin.ToString())
              .Select(ur => new { Id = ur.RoleId, Name = ur.Role.Name })
              .ToList();

            var rolesList = userRoles.Select(ur => new Dictionary<string, object>
            {
                { "id", ur.Id },
                { "name", ur.Name }
            }).ToList();

            return rolesList;
        }

        public async Task<string> FindUserRole(string UserId)
        {
            var userRole = await _context.UsersRoles
                .Where( ur => ur.UserId == UserId)
                .Select(ur => ur.Role.Name)
                .SingleOrDefaultAsync();

            return userRole;
        }
        public async Task<List<string>> FindUserRolesNames(string UserId)
        {
            var UserRoles = _context.UsersRoles
                .Where(userRoles =>userRoles.UserId==UserId)
                .Select(userRoles =>userRoles.Role.Name)
                .ToList();
            return UserRoles;
        }
        public async Task<List<Role>> FindUserRoles(string userId)
        {
            return await _context.UsersRoles
                                    .Where(ur => ur.UserId == userId)
                                    .Select(ur => ur.Role)
                                    .ToListAsync();
        }
        private async Task<Dictionary<int, int>> GetRoleUserCounts()
        {
            var roleUserCounts = await _context.UsersRoles
                .GroupBy(ur => ur.RoleId)
                .Select(g => new { RoleId = g.Key, Count = g.Count() })
                .ToDictionaryAsync(item => item.RoleId, item => item.Count);

            return roleUserCounts;
        }
    }
}
