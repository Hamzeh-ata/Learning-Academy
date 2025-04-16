using Arkan.Server.Enums;
using Arkan.Server.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Arkan.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ConfirmedOrdersController : ControllerBase
    {
        private readonly IOrdersInterface _IOrderservice;
        public ConfirmedOrdersController(IOrdersInterface Orderservice)
        {
            _IOrderservice = Orderservice;
        }
        [HttpGet]
        public async Task<IActionResult> GetOrders(int pageNumber = 1, int pageSize = 10)
        {

            var result = await _IOrderservice.GetConfirmedOrders(pageNumber, pageSize);

            return Ok(result);
        }

        [HttpGet("export")]
        public async Task<IActionResult> ExportConfirmedOrdersToExcel()
        {

            var orders = await _IOrderservice.GetConfirmedOrders();

            var excelData = _IOrderservice.GenerateConfirmedOrdersExcelFile(orders);

            return File(excelData, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "ConfirmedOrders.xlsx");
        }

        [HttpGet("export{OrderId}")]
        public async Task<IActionResult> ExportConfirmedOrdersToExcel(int OrderId)
        {
            var data = _IOrderservice.GenerateOrderPaymentsExcelFile(OrderId);

            if(data.Key != ResponseKeys.Success.ToString())
            {
                return BadRequest(data.Key);
            }

            return File(data.Excel, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", data.FileName);
        }

        [HttpPost("Delete")]
        public async Task<IActionResult> DeleteOrders(List<int> Ids)
        {

            var result = await _IOrderservice.DeleteOrders(Ids);

            if (result != ResponseKeys.Success.ToString())
            {
                return BadRequest(result);
            }

            return Ok(result);
        }
    }
}
