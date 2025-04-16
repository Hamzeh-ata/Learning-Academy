using Arkan.Server.Enums;
using Arkan.Server.Interfaces;
using Arkan.Server.PageModels.CategoriesModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Arkan.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryInterface _CategoryRepository;
        public CategoryController(ICategoryInterface CategoryRepository)
        {
            _CategoryRepository= CategoryRepository;

        }

        [HttpPost("")]
        public async Task<IActionResult> AddCategory([FromForm] AddCategory model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var result = await _CategoryRepository.AddCategory(model);

            if(result.Key != ResponseKeys.Success.ToString())
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [HttpGet("")]
        public async Task<IActionResult> GetAllCategories()
        {
            var result = await _CategoryRepository.GetAllCategories();

            return Ok(result);
        }

        [HttpPut("")]
        public async Task<IActionResult> UpdateCategory([FromForm] UpdateCategory model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _CategoryRepository.UpdateCategory(model);

            if (result.Key != ResponseKeys.Success.ToString())
            {
                return BadRequest(result);
            }
            return Ok(result);
        }

        [HttpDelete("{CategoryId}")]
        public async Task<IActionResult> RemoveCategory(int CategoryId)
        {
            if (CategoryId <= 0)
            {
                return BadRequest();
            }

            var result = await _CategoryRepository.RemoveCategory(CategoryId);

            if (result != ResponseKeys.Success.ToString())
            {
                return BadRequest(result);
            }

            return Ok(result);
        }
    }
}
