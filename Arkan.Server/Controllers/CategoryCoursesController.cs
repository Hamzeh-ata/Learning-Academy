using Arkan.Server.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Arkan.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryCoursesController : ControllerBase
    {
        private readonly ICategoryInterface _CategoryRepository;
        public CategoryCoursesController(ICategoryInterface CategoryRepository)
        {
            _CategoryRepository = CategoryRepository;

        }
        [HttpGet("{CategoryId}")]
        public async Task<IActionResult> GetRelatedCourses(int CategoryId)
        {
            if (CategoryId <= 0)
            {
                return BadRequest();
            }

            var result = await _CategoryRepository.GetRelatedCourses(CategoryId);

            return Ok(result);
        }


    }
}
