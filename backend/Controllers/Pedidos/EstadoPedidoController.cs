using backend.Application.Queries.EstadoPedidoQuery.ListarEstadoCombo;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers.Pedidos
{
    [Route("api/[controller]")]
    [ApiController]
    public class EstadoPedidoController: ControllerBase
    {
        private readonly IMediator mediator;
        public EstadoPedidoController(IMediator mediator)
        {
            this.mediator = mediator;
        }

        // GET : EstadoPedidoListarEstadoPedidoCombo
        [HttpGet("ListarEstadoPedidoCombo")]
        public async Task<IActionResult> GetRolesCombo()
        {
            var query = new ListarEstadoPedidoQuery();

            var result = await mediator.Send(query);
            return Ok(result);
        }
    }
}
