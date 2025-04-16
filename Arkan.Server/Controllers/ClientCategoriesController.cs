using Arkan.Server.Client_Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Arkan.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClientCategoriesController : ControllerBase
    {
        private readonly IClientCategories _IClientCategoriesService;
        public ClientCategoriesController(IClientCategories IClientCategoriesService)
        {
            _IClientCategoriesService = IClientCategoriesService;
        }
        [HttpGet]
        public async Task<IActionResult> GetPackages(string? name, int pageNumber = 1, int pageSize = 10)
        {
            var result = await _IClientCategoriesService.GetCategories(pageNumber, pageSize, name);

            return Ok(result);
        }
    }
}
