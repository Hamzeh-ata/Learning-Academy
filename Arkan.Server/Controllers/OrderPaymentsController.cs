using Arkan.Server.Enums;
using Arkan.Server.Interfaces;
using Arkan.Server.PageModels.Payments;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Arkan.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderPaymentsController : ControllerBase
    {

        private readonly IOrderPaymentsInterface _OrderPaymentsService;
        public OrderPaymentsController(IOrderPaymentsInterface OrderPaymentsService)
        {
            _OrderPaymentsService = OrderPaymentsService;
        }

        [HttpPost]
        public async Task<IActionResult> AddPayment(AddPayment model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var result = await _OrderPaymentsService.AddPayment(model);

            if (result.Key != ResponseKeys.Success.ToString())
            {
                return BadRequest(result);
            }

            return Ok(result);

        }

        [HttpDelete("{paymentId}")]
        public async Task<IActionResult> DeletePayment(int paymentId)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var result = await _OrderPaymentsService.RemovePayment(paymentId);

            if (result != ResponseKeys.Success.ToString())
            {
                return BadRequest(result);
            }

            return Ok(result);

        }

        [HttpGet("{orderId}")]
        public async Task<IActionResult> GetOrderPayments(int orderId)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _OrderPaymentsService.GetOrderPayments(orderId);

            return Ok(result);

        }

    }
}
