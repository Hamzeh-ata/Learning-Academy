using Arkan.Server.Interfaces;
using Arkan.Server.PageModels.OrdersModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Arkan.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderFiltersController : ControllerBase
    {
        private readonly IOrdersFilter _OrdersFilterService;
        public OrderFiltersController(IOrdersFilter OrdersFilterService)
        {
            _OrdersFilterService = OrdersFilterService;
        }

        [HttpGet("ConfirmedOrders")]
        public async Task<IActionResult> FilterConfirmedOrders([FromQuery] OrdersFilter model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _OrdersFilterService.GetFilteredConfirmedOrders(model);

            return Ok(result);

        }

        [HttpGet("PendingOrders")]
        public async Task<IActionResult> FilterPendingOrders([FromQuery] OrdersFilter model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _OrdersFilterService.GetFilteredPendingOrders(model);

            return Ok(result);

        }
    }
}
