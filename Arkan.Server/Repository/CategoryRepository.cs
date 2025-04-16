using Arkan.Server.BaseRepository;
using Arkan.Server.Data;
using Arkan.Server.Enums;
using Arkan.Server.Helpers;
using Arkan.Server.ImagesHelper;
using Arkan.Server.Interfaces;
using Arkan.Server.Models;
using Arkan.Server.PageModels.CategoriesModels;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;

namespace Arkan.Server.Repository
{
    public class CategoryRepository : ICategoryInterface
    {
        private readonly ApplicationDBContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IBaseRepository _IBaseRepository;
        private readonly ImageHelperInterface _ImageHelper;
        public CategoryRepository(ApplicationDBContext context, UserManager<ApplicationUser> userManager, IBaseRepository IBaseRepository, ImageHelperInterface ImageHelper)
        {
            _context = context;
            _userManager = userManager;
            _IBaseRepository = IBaseRepository;
            _ImageHelper = ImageHelper;
        }

        public async Task<GetAddedCategory> AddCategory(AddCategory model)
        {
            if (string.IsNullOrWhiteSpace(model.Name))
            {
                return new GetAddedCategory { Key = ResponseKeys.InvalidInput.ToString() };
            }

            var isCategoryNameExists = await _context.Categories.AnyAsync(Category => Category.Name == model.Name);
            if (isCategoryNameExists)
            {
                return new GetAddedCategory  { Key = ResponseKeys.NameExists.ToString() };
            }

            if (!Enum.IsDefined(typeof(CategoryStatus), model.Status))
            {
                return new GetAddedCategory { Key = ResponseKeys.InvalidStatus.ToString() };
            }

            var category = new Category
            {
                Name = model.Name.Trim(),
                Status = model.Status,
                Description = model.Description?.Trim(),
            };


            if (model.Image != null)
            {
                var imageTask = await _ImageHelper.AddImage(model.Image, ImagesFiles.categories.ToString());
                category.Image = imageTask;
            }



            await _IBaseRepository.AddAsync(category);

            return new GetAddedCategory
            {
                Id = category.Id,
                Name = category.Name,
                Description = category.Description,
                Status = category.Status,
                Image = category.Image,
                Key = ResponseKeys.Success.ToString()
            };
        }

        public async Task<List<GetCategories>> GetAllCategories()
        {
            var Categories = await _context.Categories
                .Select(Category => new GetCategories
                {
                    Id = Category.Id,
                    Name = Category.Name,
                    CoursesCount = Category.CoursesCategories.Count(),
                    Status = Category.Status,
                    Description = Category.Description,
                    Image = Category.Image
                }).ToListAsync();

            return Categories;

        }

        public async Task<GetCategory> UpdateCategory(UpdateCategory model)
        {

            if (string.IsNullOrWhiteSpace(model.Name))
            {
                return new GetCategory()
                {
                    Key = ResponseKeys.InvalidInput.ToString()
                };
            }

            var isCategoryNameExists = await _context.Categories.AnyAsync(Category => Category.Name == model.Name && Category.Id != model.Id);
            if (isCategoryNameExists)
            {
                return new GetCategory()
                {
                    Key = ResponseKeys.NameExists.ToString()
                };

            }

            if (!Enum.IsDefined(typeof(CategoryStatus), model.Status))
            {
                return new GetCategory()
                {
                    Key = ResponseKeys.InvalidStatus.ToString()
                };
            }

            var category = await _context.Categories.Where(Category => Category.Id == model.Id).FirstOrDefaultAsync();
            if (category is null)
            {
                return new GetCategory()
                {
                    Key = ResponseKeys.CategoryNotFound.ToString()
                };
            }


            if (model.Image != null && !(model.Image is string))
            {
                if (!string.IsNullOrEmpty(category.Image))
                {
                    await _ImageHelper.DeleteImage(category.Image);
                }

                category.Image = await _ImageHelper.AddImage(model.Image, ImagesFiles.categories.ToString());
            }



            category.Name = model.Name.Trim();
            category.Status = model.Status;
            category.Description = model.Description?.Trim();

            _IBaseRepository.Update(category);

            return new GetCategory
            {
                Id = category.Id,
                Name = category.Name,
                Status = category.Status,
                Description = category.Description,
                Image = category.Image,
                Key = ResponseKeys.Success.ToString()
            };
        }

        public async Task<GetRelatedCourses> GetRelatedCourses(int categoryId)
        {

            var categoryCourses = await _context.Categories
                .Where(c => c.Id == categoryId)
                .SelectMany(c => c.CoursesCategories)
                .Include(cc => cc.Course)
                .ThenInclude(c => c.Enrollments)
                .Select(cc => new CourseInfo
                {
                    Id = cc.Course.Id,
                    Name = cc.Course.Name,
                    Description = cc.Course.Description,
                    StudentsCount = cc.Course.Enrollments.Count,
                    InstructorName = cc.Course.InstructorId.HasValue
                        ? $"{cc.Course.Instructor!.User.FirstName} {cc.Course.Instructor.User.LastName}"
                        : null,
                    Status = cc.Course.Status.ToString(),
                }).ToListAsync();

            var relatedCourses = new GetRelatedCourses
            {
                CategoryId = categoryId,
                Courses = categoryCourses
            };

            return relatedCourses;
        }

        public async Task<string> RemoveCategory(int CategoryId)
        {
            var category = await _context.Categories.Where(Category => Category.Id == CategoryId).FirstOrDefaultAsync();

            if (category is null)
            {
                return ResponseKeys.CategoryNotFound.ToString();
            }

            _IBaseRepository.Remove(category);

            if (!string.IsNullOrEmpty(category.Image))
            {
                await _ImageHelper.DeleteImage(category.Image);
            }
            return ResponseKeys.Success.ToString();
        }

    }
}
