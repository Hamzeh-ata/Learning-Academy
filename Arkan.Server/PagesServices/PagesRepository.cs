using Arkan.Server.BaseRepository;
using Arkan.Server.Data;
using Arkan.Server.Enums;
using Arkan.Server.Models;
using Arkan.Server.PageModels.UserPagesModels;
using Arkan.Server.RoleServices;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace Arkan.Server.PagesServices
{
    public class PagesRepository : IPagesService
    {
        private readonly IBaseRepository _IBaseRepository;
        private readonly IRoles _IRoles;
        private readonly ApplicationDBContext _context;
        public PagesRepository(IBaseRepository IBaseRepository, IRoles IRoles, ApplicationDBContext context)
        {
            _IBaseRepository = IBaseRepository;
            _IRoles = IRoles;
            _context = context;
        }

        public async Task<GetAddedPage> AddPage(AddPageDto model)
        {
            var isPageExists = await _context.Pages.AnyAsync(p => p.Name == model.Name);

            if (isPageExists)
            {
                return new GetAddedPage
                {
                    Key = ResponseKeys.NameExists.ToString()
                };
            }

            var page = new Page
            {
                Name = model.Name,
                ComponentName = model.ComponentName
            };

            await _IBaseRepository.AddAsync(page);

            return new GetAddedPage
            {
                Id = page.Id,
                Name = model.Name,
                ComponentName = model.ComponentName,
                Key = ResponseKeys.Success.ToString()
            };

        }

        public async Task<GetUserPagesDto> GetUserPages(string userId)
        {
            var userRoles = await _IRoles.FindUserRoles(userId);
            bool isAdmin = userRoles.Any(role => role.Name == Roles.Admin.ToString());

            var userRoleIds = userRoles.Select(ur => ur.Id).ToList();

            var pagePermissionsQuery = _context.PagePermissions
                .Where(pp => userRoleIds.Contains(pp.RoleId))
                .Include(pp => pp.Permissions)
                .Include(pp => pp.Page)
                .ThenInclude(p => p.PagePermissions);

            var groupedPagePermissions = pagePermissionsQuery
                .GroupBy(pp => pp.PageId)
                .Select(group => new
                {
                    PageId = group.Key,
                    Permissions = group.Select(pp => pp.Permissions.Name).ToList(),
                    RoleName = group.First().Role.Name
                }).ToList();

            var getUserPagesDto = new GetUserPagesDto
            {
                IsAdmin = isAdmin,
                Pages = pagePermissionsQuery
                    .GroupBy(pp => pp.PageId)
                    .Select(group => new UserPagesDto
                    {
                        Id = group.Key,
                        Name = group.First().Page.Name,
                        ComponentName = group.First().Page.ComponentName,
                        Permissions = new List<UserPagesPermissionsDto>
                        {
                            new UserPagesPermissionsDto
                            {
                                Create = group.Any(pp => pp.Permissions.Name == Enums.Permissions.Create.ToString()),
                                View = group.Any(pp => pp.Permissions.Name == Enums.Permissions.View.ToString()),
                                Edit = group.Any(pp => pp.Permissions.Name == Enums.Permissions.Edit.ToString()),
                                Delete = group.Any(pp => pp.Permissions.Name == Enums.Permissions.Delete.ToString())
                            }
                        }
                    }).ToList()
            };

            return getUserPagesDto;
        }
    }
}
