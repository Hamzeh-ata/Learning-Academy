using Arkan.Server.Enums;
using Arkan.Server.Interfaces;
using Arkan.Server.PagesServices;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Arkan.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PendingOrdersController : ControllerBase
    {

        private readonly IOrdersInterface _IOrderservice;
        public PendingOrdersController(IOrdersInterface Orderservice)
        {
            _IOrderservice = Orderservice;
        }

        [HttpGet]
        public async Task<IActionResult> GetOrders(int pageNumber = 1, int pageSize=10)
        {

            var result = await _IOrderservice.GetOrders(pageNumber, pageSize);

            return Ok(result);
        }

        [HttpPost("ConfirmOrders")]
        public async Task<IActionResult> ConfirmOrders(List<int> Ids)
        {
            var userId = await GetCurrentUserIdAsync();

            if (userId is null)
            {
                return Unauthorized();
            }
            var result = await _IOrderservice.ConfirmOrders(Ids,userId);

            if (result != ResponseKeys.Success.ToString())
            {
                return BadRequest(result);
            }
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> DeleteOrders(List<int> Ids)
        {

            var result = await _IOrderservice.DeleteOrders(Ids);

            if (result != ResponseKeys.Success.ToString())
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [HttpGet("export")]
        public async Task<IActionResult> ExportConfirmedOrdersToExcel()
        {
            var orders = await _IOrderservice.GetOrders();

            var excelData = _IOrderservice.GeneratePendingOrdersExcelFile(orders);

            return File(excelData, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "PendingOrders.xlsx");
        }
        private async Task<string> GetCurrentUserIdAsync()
        {
            if (!User.Identity.IsAuthenticated)
            {
                return null;
            }

            var userId = User.FindFirst("uid")?.Value;

            return userId;
        }
    }
}
