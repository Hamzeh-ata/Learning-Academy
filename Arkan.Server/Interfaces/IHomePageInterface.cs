using Arkan.Server.PageModels.HomePageModels;

namespace Arkan.Server.Interfaces
{
    public interface IHomePageInterface
    {
        Task<GetHeroSection> GetHeroSection();
        Task<GetHeroSection> AddHeroSection(AddHeroSection model);
        Task<GetHeroSection> UpdateHeroSection(UpdateHeroSection model);
        Task<List<GetCoursesSection>> GetCourseSections();
        Task<GetCourseSection> AddCoursesSection(AddCoursesSection model);
        Task<string> RemoveCoursesSection(int courseItemId);
        Task<GetCategorySection> AddCategoryToSection(AddCategorySection model);
        Task<List<GetCategoriesSection>> getCategoriesSection();
        Task<string> RemoveCategoryFromSection(int categoryItemId);
        Task<GetUniversitySection> AddUniversityToSection(AddUniversitySection model);
        Task<List<GetUniversitiesSection>> GetUniversitiesSection();
        Task<string> RemoveUniversityFromSection(int universityItemId);
        Task<GetInstructorSection> AddInstructorToSection(AddInstructorSection model);
        Task<List<GetInstructorsSection>> GetInstructorsSection();
        Task<string> RemoveInstructorFromSection(int instructorItemId);
        Task<GetCompanyInfo> AddCompanyInfo(AddCompanyInfo model);
        Task<GetCompanyInfo> UpdateCompanyInfo(UpdateCompanyInfo model);
        Task<GetCompanyInfo> GetCompanyInfo();
        Task<GetStats> GetStats();










    }
}
