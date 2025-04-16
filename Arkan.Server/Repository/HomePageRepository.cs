using Arkan.Server.BaseRepository;
using Arkan.Server.Data;
using Arkan.Server.Enums;
using Arkan.Server.ImagesHelper;
using Arkan.Server.Interfaces;
using Arkan.Server.Models;
using Arkan.Server.PageModels.HomePageModels;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.Globalization;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;
using static System.Collections.Specialized.BitVector32;

namespace Arkan.Server.Repository
{
    public class HomePageRepository : IHomePageInterface
    {
        private readonly ApplicationDBContext _context;
        private readonly IBaseRepository _IBaseRepository;
        private readonly ImageHelperInterface _ImageHelper;
        public HomePageRepository(ApplicationDBContext context, IBaseRepository IBaseRepository, IWebHostEnvironment webHostEnvironment, ImageHelperInterface ImageHelper)
        {
            _context = context;
            _IBaseRepository = IBaseRepository;
            _ImageHelper = ImageHelper;
        }

        public async Task<GetHeroSection> GetHeroSection()
        {
            var heroSection = await _context.HeroSection.FirstOrDefaultAsync();

            if (heroSection == null)
            {

                return new GetHeroSection
                {
                    Key = ResponseKeys.Failed.ToString()
                };
            }

            return new GetHeroSection
            {
                Id = heroSection.Id,
                HeaderText = heroSection.HeaderText,
                Description = heroSection.Description,
                Image = heroSection.Photo,
                Key = ResponseKeys.Success.ToString()
            };


        }

        public async Task<GetHeroSection> AddHeroSection(AddHeroSection model)
        {
            var heroSectionExists = await _context.HeroSection.AnyAsync();

            if (heroSectionExists)
            {
                return new GetHeroSection
                {
                    Key = ResponseKeys.HeroSectionExists.ToString()
                };
            }

            var heroSection = new HeroSection
            {
                HeaderText = model.HeaderText,
                Description = model.Description,
            };

            if (model.Image != null)
            {
                var imageTask = await _ImageHelper.AddImage(model.Image, ImagesFiles.heroSection.ToString());
                heroSection.Photo = imageTask;
            }

            var added = await _IBaseRepository.AddAsync(heroSection);

            if (!added)
            {

                return new GetHeroSection
                {
                    Key = ResponseKeys.Failed.ToString()
                };

            }

            return new GetHeroSection
            {
                Id = heroSection.Id,
                HeaderText = heroSection.HeaderText,
                Description = heroSection.Description,
                Image = heroSection.Photo,
                Key = ResponseKeys.Success.ToString()
            };
        }

        public async Task<GetHeroSection> UpdateHeroSection(UpdateHeroSection model)
        {
            var isSectionExists = await _IBaseRepository.AnyByIdAsync<HeroSection>(model.Id);

            if (!isSectionExists)
            {
                return new GetHeroSection { Key = ResponseKeys.SectionNotFound.ToString() };
            }

            var section = await _IBaseRepository.FindByIdAsync<HeroSection>(model.Id);

            section.HeaderText = model.HeaderText;

            section.Description = model.Description;

            if (model.Image != null && !(model.Image is string))
            {
                if (!string.IsNullOrEmpty(section.Photo))
                {
                    await _ImageHelper.DeleteImage(section.Photo);
                }

                section.Photo = await _ImageHelper.AddImage(model.Image, ImagesFiles.heroSection.ToString());
            }

            var updated = _IBaseRepository.Update<HeroSection>(section);

            if (!updated)
            {
                return new GetHeroSection { Key = ResponseKeys.Failed.ToString() };
            }
            return new GetHeroSection
            {
                Id = section.Id,
                HeaderText = section.HeaderText,
                Description = section.Description,
                Image = section.Photo,
                Key = ResponseKeys.Success.ToString(),
            };
        }

        /*          Courses Section            */

        public async Task<List<GetCoursesSection>> GetCourseSections()
        {
            var courses = await _context.CoursesSection
                .Include(c => c.Course)
                    .ThenInclude(course => course.Instructor)
                .Include(c => c.Course)
                    .ThenInclude(course => course.Chapters)
                .Include(c => c.Course)
                    .ThenInclude(course => course.CoursesUnviersites)
                        .ThenInclude(cu => cu.University)
                .Select(c => new GetCoursesSection
                {
                    Id = c.Id,
                    CourseId = c.Course.Id,
                    Name = c.Course.Name,
                    InstructorName = c.Course.Instructor != null ? $"{c.Course.Instructor.User.FirstName} {c.Course.Instructor.User.LastName}" : null,
                    Description = c.Course.Description,
                    Price = c.Course.Price,
                    DiscountPrice = c.Course.DiscountPrice ?? 0,
                    Image = c.Course.Image,
                    ChaptersCount = c.Course.Chapters.Count,
                    LessonsCount = _context.Lessons.Count(lesson => lesson.Chapter.CourseId == c.Course.Id),
                    Universities = c.Course.CoursesUnviersites.Select(cu => cu.University.Name).ToList(),
                    Order = c.Order
                }).OrderBy(cs => cs.Order).ToListAsync();

            return courses;
        }

        public async Task<GetCourseSection> AddCoursesSection(AddCoursesSection model)
        {

            var courseExists = await _IBaseRepository.AnyByIdAsync<Course>(model.CourseId);

            if (!courseExists)
            {
                return new GetCourseSection
                {
                    Key = ResponseKeys.CourseNotFound.ToString()
                };
            }

            var courseAddedBefore = await _context.CoursesSection.AnyAsync(cs => cs.CourseId == model.CourseId);

            if (courseAddedBefore)
            {
                return new GetCourseSection
                {
                    Key = ResponseKeys.CourseAddedBefore.ToString()
                };
            }


            var orderExists = await _context.CoursesSection.AnyAsync(cs => cs.Order == model.Order);

            if (orderExists)
            {
                return new GetCourseSection
                {
                    Key = ResponseKeys.OrderExists.ToString()
                };
            }


            var courseSection = new CoursesSection
            {
                CourseId = model.CourseId,
                Order = model.Order,
            };

            var added = await _IBaseRepository.AddAsync(courseSection);

            if (!added)
            {

                return new GetCourseSection
                {
                    Key = ResponseKeys.Failed.ToString()
                };

            }

            var course = await _context.CoursesSection
                .Where(cs => cs.Id == courseSection.Id)
               .Include(c => c.Course)
                   .ThenInclude(course => course.Instructor)
               .Include(c => c.Course)
                   .ThenInclude(course => course.Chapters)
                    .ThenInclude(course => course.Lessons)
               .Include(c => c.Course)
                   .ThenInclude(course => course.CoursesUnviersites)
                       .ThenInclude(cu => cu.University)
               .Select(c => new GetCourseSection
               {
                   Id = c.Id,
                   CourseId = c.Course.Id,
                   Name = c.Course.Name,
                   InstructorName = c.Course.Instructor != null ? $"{c.Course.Instructor.User.FirstName} {c.Course.Instructor.User.LastName}" : null,
                   Description = c.Course.Description,
                   Price = c.Course.Price,
                   DiscountPrice = c.Course.DiscountPrice ?? 0,
                   Image = c.Course.Image,
                   ChaptersCount = c.Course.Chapters.Count,
                   LessonsCount = _context.Lessons.Count(lesson => lesson.Chapter.CourseId == c.Course.Id),
                   Universities = c.Course.CoursesUnviersites.Select(cu => cu.University.Name).ToList(),
                   Order = c.Order,
                   Key = ResponseKeys.Success.ToString()
               }).FirstOrDefaultAsync();

            return course;
        }

        public async Task<GetCourseSection> UpdateCoursesSection(UpdateCoursesSection model)
        {
            var isSectionExists = await _IBaseRepository.AnyByIdAsync<CoursesSection>(model.Id);

            if (!isSectionExists)
            {
                return new GetCourseSection
                {
                    Key = ResponseKeys.SectionNotFound.ToString()
                };
            }

            var courseExists = await _IBaseRepository.AnyByIdAsync<Course>(model.CourseId);

            if (!courseExists)
            {
                return new GetCourseSection
                {
                    Key = ResponseKeys.CourseNotFound.ToString()
                };
            }
            var section = await _IBaseRepository.FindByIdAsync<CoursesSection>(model.Id);

            section.CourseId = model.Id;

            section.Order = model.Order;

            var updated = _IBaseRepository.Update<CoursesSection>(section);

            if (!updated)
            {
                return new GetCourseSection
                {
                    Key = ResponseKeys.Failed.ToString()
                };
            }

            var course = await _context.CoursesSection
            .Where(cs => cs.Id == section.Id)
           .Include(c => c.Course)
               .ThenInclude(course => course.Instructor)
           .Include(c => c.Course)
               .ThenInclude(course => course.Chapters)
           .Include(c => c.Course)
               .ThenInclude(course => course.CoursesUnviersites)
                   .ThenInclude(cu => cu.University)
           .Select(c => new GetCourseSection
           {
               Id = c.Id,
               CourseId = c.Course.Id,
               Name = c.Course.Name,
               InstructorName = c.Course.Instructor != null ? $"{c.Course.Instructor.User.FirstName} {c.Course.Instructor.User.LastName}" : null,
               Description = c.Course.Description,
               Price = c.Course.Price,
               DiscountPrice = c.Course.DiscountPrice ?? 0,
               Image = c.Course.Image,
               ChaptersCount = c.Course.Chapters.Count,
               LessonsCount = _context.Lessons.Count(lesson => lesson.Chapter.CourseId == c.Course.Id),
               Universities = c.Course.CoursesUnviersites.Select(cu => cu.University.Name).ToList(),
               Order = c.Order
           }).FirstOrDefaultAsync();

            return course;


        }

        public async Task<string> RemoveCoursesSection(int courseItemId)
        {
            var isSectionExists = await _IBaseRepository.AnyByIdAsync<CoursesSection>(courseItemId);

            if (!isSectionExists)
            {
                return ResponseKeys.SectionNotFound.ToString();
            }

            var section = await _IBaseRepository.FindByIdAsync<CoursesSection>(courseItemId);

            var removed = _IBaseRepository.Remove<CoursesSection>(section);

            if (!removed)
            {
                return ResponseKeys.Failed.ToString();
            }

            return ResponseKeys.Success.ToString();

        }

        /*          Categories Section            */

        public async Task<GetCategorySection> AddCategoryToSection(AddCategorySection model)
        {

            var categoryExists = await _IBaseRepository.AnyByIdAsync<Category>(model.CategoryId);

            if (!categoryExists)
            {
                return new GetCategorySection
                {
                    Key = ResponseKeys.CategoryNotFound.ToString()
                };
            }

            var categoryAddedBefore = await _context.CategoriesSection.AnyAsync(cs => cs.CategoryId == model.CategoryId);

            if (categoryAddedBefore)
            {
                return new GetCategorySection
                {
                    Key = ResponseKeys.CategoryAddedBefore.ToString()
                };
            }


            var orderExists = await _context.CategoriesSection.AnyAsync(cs => cs.Order == model.Order);

            if (orderExists)
            {
                return new GetCategorySection
                {
                    Key = ResponseKeys.OrderExists.ToString()
                };
            }


            var categorySection = new CategoriesSection
            {
                CategoryId = model.CategoryId,
                Order = model.Order,
            };

            var added = await _IBaseRepository.AddAsync(categorySection);

            if (!added)
            {
                return new GetCategorySection
                {
                    Key = ResponseKeys.Failed.ToString()
                };
            }

            var category = await _context.Categories
                .Where(c => c.Id == categorySection.CategoryId)
                .Select(c => new GetCategorySection
                {
                    Id = categorySection.Id,
                    CategoryId = c.Id,
                    Order = categorySection.Order,
                    Name = c.Name,
                    Description = c.Description,
                    Image = c.Image,
                    CoursesCount = c.CoursesCategories.Count,
                    Key = ResponseKeys.Success.ToString()
                }).FirstOrDefaultAsync();

            return category;
        }

        public async Task<List<GetCategoriesSection>> getCategoriesSection()
        {
            return await _context.CategoriesSection
               .Include(cs => cs.Category)
                 .Select(c => new GetCategoriesSection
                 {
                     Id = c.Id,
                     CategoryId = c.Category.Id,
                     Order = c.Order,
                     Name = c.Category.Name,
                     Description = c.Category.Description,
                     Image = c.Category.Image,
                     CoursesCount = c.Category.CoursesCategories.Count,
                 }).OrderBy(cs => cs.Order).ToListAsync();
        }

        public async Task<string> RemoveCategoryFromSection(int categoryItemId)
        {
            var categorySectionExists = await _IBaseRepository.AnyByIdAsync<CategoriesSection>(categoryItemId);

            if (!categorySectionExists)
            {
                return ResponseKeys.SectionNotFound.ToString();
            }

            var section = await _IBaseRepository.FindByIdAsync<CategoriesSection>(categoryItemId);

            var removed = _IBaseRepository.Remove<CategoriesSection>(section);

            if (!removed)
            {
                return ResponseKeys.Failed.ToString();
            }

            return ResponseKeys.Success.ToString();
        }


        /*          Universities Section            */


        public async Task<GetUniversitySection> AddUniversityToSection(AddUniversitySection model)
        {

            var universityExists = await _IBaseRepository.AnyByIdAsync<University>(model.UniversityId);

            if (!universityExists)
            {
                return new GetUniversitySection
                {
                    Key = ResponseKeys.UniversityNotFound.ToString()
                };
            }

            var universityAddedBefore = await _context.UniversitiesSection.AnyAsync(us => us.UniversityId == model.UniversityId);

            if (universityAddedBefore)
            {
                return new GetUniversitySection
                {
                    Key = ResponseKeys.UniversityAddedBefore.ToString()
                };
            }


            var orderExists = await _context.UniversitiesSection.AnyAsync(us => us.Order == model.Order);

            if (orderExists)
            {
                return new GetUniversitySection
                {
                    Key = ResponseKeys.OrderExists.ToString()
                };
            }


            var universitySection = new UniversitiesSection
            {
                UniversityId = model.UniversityId,
                Order = model.Order,
            };

            var added = await _IBaseRepository.AddAsync(universitySection);

            if (!added)
            {

                return new GetUniversitySection
                {
                    Key = ResponseKeys.Failed.ToString()
                };

            }


            var university = await _context.Unviersites
                .Where(u => u.Id == universitySection.UniversityId)
                .Select(u => new GetUniversitySection
                {
                    Id = universitySection.Id,
                    UniversityId = u.Id,
                    Order = universitySection.Order,
                    Name = u.Name,
                    ShortName = u.ShortName,
                    Image = u.Image,
                    Key = ResponseKeys.Success.ToString()
                }).FirstOrDefaultAsync();

            return university;
        }

        public async Task<List<GetUniversitiesSection>> GetUniversitiesSection()
        {
            var selectedUniversities = await _context.UniversitiesSection
                .Select(us => us.UniversityId)
                .ToListAsync();

            return await _context.UniversitiesSection
               .Include(us => us.University)
                 .Select(us => new GetUniversitiesSection
                 {
                     Id = us.Id,
                     UniversityId = us.University.Id,
                     Order = us.Order,
                     Name = us.University.Name,
                     ShortName = us.University.ShortName,
                     Image = us.University.Image,
                 }).OrderBy(cs => cs.Order).ToListAsync();
        }

        public async Task<string> RemoveUniversityFromSection(int universityItemId)
        {
            var universitySectionExists = await _IBaseRepository.AnyByIdAsync<UniversitiesSection>(universityItemId);

            if (!universitySectionExists)
            {
                return ResponseKeys.SectionNotFound.ToString();
            }

            var section = await _IBaseRepository.FindByIdAsync<UniversitiesSection>(universityItemId);

            //var section = await _context.UniversitiesSection
            //    .Where(us => us.UniversityId ==  universityItemId)
            //    .FirstOrDefaultAsync();

            //if(section == default)
            //{
            //   return ResponseKeys.SectionNotFound.ToString();
            //}
            var removed = _IBaseRepository.Remove<UniversitiesSection>(section);

            if (!removed)
            {
                return ResponseKeys.Failed.ToString();
            }

            return ResponseKeys.Success.ToString();
        }


        /*          Instructors Section            */


        public async Task<GetInstructorSection> AddInstructorToSection(AddInstructorSection model)
        {

            var instructorId = await GetInstructorIdByUserID(model.UserId);


            if (instructorId == 0)
            {
                return new GetInstructorSection
                {
                    Key = ResponseKeys.InstructorNotFound.ToString()
                };
            }

            var instructorAddedBefore = await _context.InstructorsSection.AnyAsync(s => s.InstructorId == instructorId);

            if (instructorAddedBefore)
            {
                return new GetInstructorSection
                {
                    Key = ResponseKeys.InstructorAddedBefore.ToString()
                };
            }


            var orderExists = await _context.InstructorsSection.AnyAsync(us => us.Order == model.Order);

            if (orderExists)
            {
                return new GetInstructorSection
                {
                    Key = ResponseKeys.OrderExists.ToString()
                };
            }


            var instructorsSection = new InstructorsSection
            {
                InstructorId = instructorId,
                Order = model.Order,
            };

            var added = await _IBaseRepository.AddAsync(instructorsSection);

            if (!added)
            {

                return new GetInstructorSection
                {
                    Key = ResponseKeys.Failed.ToString()
                };

            }


            var instructor = await _context.Instructors
                .Where(u => u.Id == instructorsSection.InstructorId)
                .Select(u => new GetInstructorSection
                {
                    Id = instructorsSection.Id,
                    UserId = u.UserId,
                    Order = instructorsSection.Order,
                    Name = $"{u.User.FirstName} {u.User.LastName}",
                    Image = u.User.ProfileImage,
                    Key = ResponseKeys.Success.ToString()
                }).FirstOrDefaultAsync();

            return instructor;
        }

        public async Task<List<GetInstructorsSection>> GetInstructorsSection()
        {
            return await _context.InstructorsSection
               .Include(us => us.Instructor)
                 .Select(us => new GetInstructorsSection
                 {
                     Id = us.Id,
                     InstructorId = us.Instructor.Id.ToString(),
                     UserId = us.Instructor.User.Id.ToString(),
                     Order = us.Order,
                     Name = $"{us.Instructor.User.FirstName} {us.Instructor.User.LastName}",
                     Image = us.Instructor.User.ProfileImage,
                 }).OrderBy(cs => cs.Order).ToListAsync();
        }

        public async Task<string> RemoveInstructorFromSection(int instructorItemId)
        {
            var instructorSectionExists = await _IBaseRepository.AnyByIdAsync<InstructorsSection>(instructorItemId);

            if (!instructorSectionExists)
            {
                return ResponseKeys.SectionNotFound.ToString();
            }

            var section = await _IBaseRepository.FindByIdAsync<InstructorsSection>(instructorItemId);

            var removed = _IBaseRepository.Remove<InstructorsSection>(section);

            if (!removed)
            {
                return ResponseKeys.Failed.ToString();
            }

            return ResponseKeys.Success.ToString();
        }


        /*          CompanyInfo Section            */


        public async Task<GetCompanyInfo> AddCompanyInfo(AddCompanyInfo model)
        {



            var AlreadyExists = await _context.CompanyInfo.AnyAsync();

            if (AlreadyExists)
            {
                return new GetCompanyInfo
                {
                    Key = ResponseKeys.AlreadyExists.ToString()
                };
            }


            var companyInfo = new CompanyInfo
            {
                AboutUs = model.AboutUs,
                FacebookUrl = model.FacebookUrl,
                InstagramUrl = model.InstagramUrl,
                TikTokUrl = model.TikTokUrl,
                SnapchatUrl = model.SnapchatUrl,
                Phonenumber = model.Phonenumber
            };


            if (model.Image != null)
            {
                var imageTask = await _ImageHelper.AddImage(model.Image, ImagesFiles.companyInfo.ToString());

                companyInfo.Logo = imageTask;
            }


            var added = await _IBaseRepository.AddAsync(companyInfo);

            if (!added)
            {

                return new GetCompanyInfo
                {
                    Key = ResponseKeys.Failed.ToString()
                };

            }


            var addedCompanyInfo = await _context.CompanyInfo
                .Select(u => new GetCompanyInfo
                {
                    Id = companyInfo.Id,
                    AboutUs = companyInfo.AboutUs,
                    FacebookUrl = companyInfo.FacebookUrl,
                    InstagramUrl = companyInfo.InstagramUrl,
                    TikTokUrl = companyInfo.TikTokUrl,
                    SnapchatUrl = companyInfo.SnapchatUrl,
                    Phonenumber = companyInfo.Phonenumber,
                    Image = companyInfo.Logo,
                    Key = ResponseKeys.Success.ToString()
                }).FirstOrDefaultAsync();

            return addedCompanyInfo;
        }
        public async Task<GetCompanyInfo> UpdateCompanyInfo(UpdateCompanyInfo model)
        {

            var isCompanyInfoExists = await _IBaseRepository.AnyByIdAsync<CompanyInfo>(model.Id);

            if (!isCompanyInfoExists)
            {
                return new GetCompanyInfo
                {
                    Key = ResponseKeys.NotFound.ToString()
                };
            }

            var companyInfo = await _IBaseRepository.FindByIdAsync<CompanyInfo>(model.Id);

            companyInfo.AboutUs = model.AboutUs;
            companyInfo.FacebookUrl = model.FacebookUrl;
            companyInfo.InstagramUrl = model.InstagramUrl;
            companyInfo.TikTokUrl = model.TikTokUrl;
            companyInfo.SnapchatUrl = model.SnapchatUrl;
            companyInfo.Phonenumber = model.Phonenumber;

            if (model.Image != null && !(model.Image is string))
            {
                if (!string.IsNullOrEmpty(companyInfo.Logo))
                {
                    await _ImageHelper.DeleteImage(companyInfo.Logo);
                }

                companyInfo.Logo = await _ImageHelper.AddImage(model.Image, ImagesFiles.companyInfo.ToString());
            }

            var updated = _IBaseRepository.Update<CompanyInfo>(companyInfo);

            if (!updated)
            {

                return new GetCompanyInfo
                {
                    Key = ResponseKeys.Failed.ToString()
                };

            }

            return new GetCompanyInfo
            {
                Id = companyInfo.Id,
                AboutUs = companyInfo.AboutUs,
                FacebookUrl = companyInfo.FacebookUrl,
                InstagramUrl = companyInfo.InstagramUrl,
                TikTokUrl = companyInfo.TikTokUrl,
                SnapchatUrl = companyInfo.SnapchatUrl,
                Phonenumber = companyInfo.Phonenumber,
                Image = companyInfo.Logo,
                Key = ResponseKeys.Success.ToString()
            };
        }
        public async Task<GetCompanyInfo> GetCompanyInfo()
        {
            var companyInfo = await _context.CompanyInfo.FirstOrDefaultAsync();

            if (companyInfo == null)
            {

                return new GetCompanyInfo
                {
                    Key = ResponseKeys.Failed.ToString()
                };
            }

            return new GetCompanyInfo
            {
                Id = companyInfo.Id,
                AboutUs = companyInfo.AboutUs,
                FacebookUrl = companyInfo.FacebookUrl,
                InstagramUrl = companyInfo.InstagramUrl,
                TikTokUrl = companyInfo.TikTokUrl,
                SnapchatUrl = companyInfo.SnapchatUrl,
                Phonenumber = companyInfo.Phonenumber,
                Image = companyInfo.Logo,
                Key = ResponseKeys.Success.ToString()
            };


        }


        /*  Stats  */


        public async Task<GetStats> GetStats()
        {
            var instructorsCount = await _context.Instructors.CountAsync();
            var studentsCount = await _context.Students.CountAsync();
            var coursesCount = await _context.Courses.CountAsync();
            var videosCount = await _context.Lessons.CountAsync();

            return new GetStats
            {
                InstructorsCount = instructorsCount,
                StudentsCount = studentsCount,
                CoursesCount = coursesCount,
                VideosCount = videosCount,
            };
        }




        private async Task<int> GetInstructorIdByUserID(string userId)
        {
            var InstructorId = await _context.Instructors.Where(s => s.UserId == userId).Select(s => s.Id).FirstOrDefaultAsync();

            return InstructorId;
        }

    }
}
