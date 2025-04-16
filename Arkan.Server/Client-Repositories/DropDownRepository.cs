using Arkan.Server.BaseRepository;
using Arkan.Server.Client_Interfaces;
using Arkan.Server.Client_PageModels.DropDown;
using Arkan.Server.Data;
using Arkan.Server.Helpers;
using Arkan.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace Arkan.Server.Client_Repositories
{
    public class DropDownRepository: IDropDown
    {
        private readonly ApplicationDBContext _context;
        public DropDownRepository(ApplicationDBContext context)
        {
            _context = context;
        }
        public async Task<TypedDropDownResponse> GetData(GetDropDown model)
        {
            Type entityType = model.Type switch
            {
                "Instructors" => typeof(Instructor),
                "Categories" => typeof(Category),
                "Packages" => typeof(Package),
                "Universities" => typeof(University),
                "Courses" => typeof(Course),
                "Students" => typeof(Student),
                _ => throw new ArgumentException("Invalid entity type"),
            };

            List<GetDropDownData>? dbSetQuery = null;

            string entityTypeName = model.Type;

            if (entityType == typeof(Instructor))
            {

                if (!string.IsNullOrEmpty(model.Name))
                {
                    dbSetQuery = await _context.Instructors.Where(i => i.User.FirstName.ToLower().Contains(model.Name.ToLower()) || i.User.LastName.ToLower().Contains(model.Name.ToLower())).Include(i => i.User).Select(q => new GetDropDownData
                    {
                        Id = q.Id,
                        Name = $"{q.User.FirstName} {q.User.LastName}",
                        UserId = q.UserId
                 }).ToListAsync();

                }
                else
                {
                    dbSetQuery = await _context.Instructors.Include(i => i.User).Select(q => new GetDropDownData
                    {
                        Id = q.Id,
                        Name = $"{q.User.FirstName} {q.User.LastName}",
                        UserId = q.UserId
                    }).ToListAsync();
                }
            }
            else if (entityType == typeof(Category))
            {
                if (!string.IsNullOrEmpty(model.Name))
                {
                    dbSetQuery = await _context.Categories.Where(c => c.Name.ToLower().Contains(model.Name.ToLower())).Select(q => new GetDropDownData
                    {
                        Id = q.Id,
                        Name = q.Name,
                    }).ToListAsync();

                }
                else
                {
                    dbSetQuery = await _context.Categories.Select(q => new GetDropDownData
                    {
                        Id = q.Id,
                        Name = q.Name
                    }).ToListAsync();
                }
            }
            else if (entityType == typeof(Package))
            {
                if (!string.IsNullOrEmpty(model.Name))
                {
                    dbSetQuery = await _context.Package.Where(c => c.Name.ToLower().Contains(model.Name.ToLower())).Select(q => new GetDropDownData
                    {
                        Id = q.Id,
                        Name = q.Name,
                    }).ToListAsync();

                }
                else
                {
                    dbSetQuery = await _context.Package.Select(q => new GetDropDownData
                    {
                        Id = q.Id,
                        Name = q.Name
                    }).ToListAsync();
                }

            }
            else if (entityType == typeof(University))
            {
                if (!string.IsNullOrEmpty(model.Name))
                {
                    dbSetQuery = await _context.Unviersites.Where(c => c.Name.ToLower().Contains(model.Name.ToLower())).Select(q => new GetDropDownData
                    {
                        Id = q.Id,
                        Name = q.Name,
                    }).ToListAsync();

                }
                else
                {
                    dbSetQuery = await _context.Unviersites.Select(q => new GetDropDownData
                    {
                        Id = q.Id,
                        Name = q.Name
                    }).ToListAsync();
                }
            }
            else if (entityType == typeof(Course))
            {
                if (!string.IsNullOrEmpty(model.Name))
                {
                    dbSetQuery = await _context.Courses.Where(c => c.Name.ToLower().Contains(model.Name.ToLower())).Select(q => new GetDropDownData
                    {
                        Id = q.Id,
                        Name = q.Name,
                    }).ToListAsync();

                }
                else
                {
                    dbSetQuery = await _context.Courses.Select(q => new GetDropDownData
                    {
                        Id = q.Id,
                        Name = q.Name
                    }).ToListAsync();
                }
            }
            else if (entityType == typeof(Student))
            {
                if (!string.IsNullOrEmpty(model.Name))
                {
                    dbSetQuery = await _context.Students.Where(i => i.User.FirstName.ToLower().Contains(model.Name.ToLower()) || i.User.LastName.ToLower().Contains(model.Name.ToLower())).Include(i => i.User).Select(q => new GetDropDownData
                    {
                        Id = q.Id,
                        Name = $"{q.User.FirstName} {q.User.LastName}",
                        UserId = q.UserId
                    }).ToListAsync();

                }
                else
                {
                    dbSetQuery = await _context.Students.Include(i => i.User).Select(q => new GetDropDownData
                    {
                        Id = q.Id,
                        Name = $"{q.User.FirstName} {q.User.LastName}",
                        UserId = q.UserId
                    }).ToListAsync();
                }
            }
            if (dbSetQuery == null)
            {
                throw new ArgumentException("Invalid entity type");
            }

            return new TypedDropDownResponse
            {
                Type = entityTypeName,
                Data = dbSetQuery
            };

        }
    }
}
