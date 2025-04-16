using Arkan.Server.BaseRepository;
using Arkan.Server.Data;
using Arkan.Server.Enums;
using Arkan.Server.Models;
using Arkan.Server.PageModels.PermissionsModels;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Arkan.Server.RoleServices
{
    public class RolePagePermissionsService: IRolePagePermission
    {
        private readonly ApplicationDBContext _context;
        private readonly IBaseRepository _IBaseRepository;
        public RolePagePermissionsService(ApplicationDBContext context, IBaseRepository IBaseRepository)
        {
            _context = context;
            _IBaseRepository = IBaseRepository;
        }
        public async Task<RolePermissionsResult> GetPageAndPermissionsForRoleAsync(int roleId)
        {
            var IsRoleExists = await _context.Role.AnyAsync(role=>role.Id == roleId);

            if (!IsRoleExists)
            {
                return new RolePermissionsResult()
                {
                    Key = ResponseKeys.RoleNotFound.ToString()
                };
            }

            var pagePermissionsInfo = await _context.Pages
                .Select(page => new PagePermissionInfo
                {
                    PageId=page.Id,
                    PageName = page.Name,
                    Permissions = page.PagePermissions.Where(pp=>pp.RoleId==roleId).Select(pp => pp.Permissions.Id).ToList()
                }).ToListAsync();

            var permissions = await _context.Permissions.Select(p => new PermissionsDto
            {
                Id = p.Id,
                Name = p.Name,

            }).ToListAsync();

            return new RolePermissionsResult
            {
                PagePermissions = pagePermissionsInfo,
                Permissions = permissions,
                Key = ResponseKeys.Success.ToString()
            };
        }
        public async Task<string> AddPagesPermissions(AddPermission model)
        {
            var IsRoleExists = await _context.Role.AnyAsync(role => role.Id == model.RoleId);

            if (!IsRoleExists)
            {
                return ResponseKeys.RoleNotFound.ToString();
            }

            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    var pagePermissionsToRemove = await _context.PagePermissions
                        .Where(pp => pp.RoleId == model.RoleId)
                        .ToListAsync();

                    if (pagePermissionsToRemove.Any())
                    {
                        _IBaseRepository.RemoveRange(pagePermissionsToRemove);
                    }

                    var flattenedPermissions = model.Permissions
                        .SelectMany(pagePermission => pagePermission.PermissionIds.Select(permissionId => new { pagePermission.PageId, PermissionId = permissionId }))
                        .ToList();

                    var permissionsToAdd = flattenedPermissions.Select(permission =>
                        new PagePermissions
                        {
                            PageId = permission.PageId,
                            PermissionsId = permission.PermissionId,
                            RoleId = model.RoleId
                        });

                    _IBaseRepository.AddRange(permissionsToAdd);

                    await _context.SaveChangesAsync();
                    await transaction.CommitAsync();
                    return ResponseKeys.Success.ToString();
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    return ex.Message;
                }
            }
        }

    }

}

