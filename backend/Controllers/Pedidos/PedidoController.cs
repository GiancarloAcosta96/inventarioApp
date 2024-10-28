using backend.Application.Commands.PedidoCommand.ConfirmarPedido;
using backend.Application.Commands.PedidoCommand.CrearPedido;
using backend.Application.Commands.PedidoCommand.EliminarPedido;
using backend.Application.Commands.ProductoCommand.CrearProducto;
using backend.Application.Commands.ProductoCommand.EditarProducto;
using backend.Application.Commands.ProductoCommand.EliminarProducto;
using backend.Application.Queries.PedidoQuery.DetallePedido;
using backend.Application.Queries.PedidoQuery.GenerarPedidoPdf;
using backend.Application.Queries.PedidoQuery.ListarPedidos;
using backend.Application.Queries.ProductoQuery.DetalleProducto;
using backend.Application.Queries.ProductoQuery.ListarProductos;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers.Pedidos
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize]
    public class PedidoController: ControllerBase
    {
        private readonly IMediator mediator;
        private readonly IPdfGenerador _pdfGeneratorService;

        public PedidoController(IMediator mediator, PdfGeneratorService pdfGeneratorService)
        {
            this.mediator = mediator;
            _pdfGeneratorService = pdfGeneratorService ?? throw new ArgumentNullException(nameof(pdfGeneratorService));
        }

        // GET: api/Pedidos/ListarPedidots
        [HttpGet("ListarPedidos")]
        public async Task<IActionResult> GetPedidos([FromQuery] Guid? estadoPedidoId, string? empresa, int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            var query = new ListarPedidosQuery
            {
                EstadoPedidoId = estadoPedidoId,
                Empresa = empresa,
                PageNumber = pageNumber,
                PageSize = pageSize
            };

            var result = await mediator.Send(query);
            return Ok(result);
        }

        // POST: api/Pedido/CrearPedido
        [HttpPost("CrearPedido")]
        public async Task<IActionResult> CreatePedido([FromBody] CrearPedidoCommand command, CancellationToken cancellationToken)
        {
            if (command == null)
            {
                return BadRequest("Error en la data al crear Pedido");
            }
            await mediator.Send(command, cancellationToken);

            return Ok();
        }

        // Get: Obtener pedido by id
        [HttpGet("ObtenerPedidoById")]
        public async Task<IActionResult> GetPedidoDetalle(Guid pedidoId)
        {
            var query = new DetallePedidoQuery { PedidoId = pedidoId };
            var detalleProducto = await mediator.Send(query);
            return Ok(detalleProducto);
        }

        // Detalle Pedido by Id
        [HttpGet("GenerarPdfByPedidoId")]
        public async Task<IActionResult> GetPedidoDetallePDF(Guid pedidoId)
        {
            var query = new DetallePedidoQuery { PedidoId = pedidoId };
            var detallePedido = await mediator.Send(query);

            if (detallePedido == null)
            {
                return NotFound();
            }

            try
            {
                var pdfFilePath = await _pdfGeneratorService.GeneratePdf(detallePedido);
                return File(System.IO.File.ReadAllBytes(pdfFilePath), "application/pdf", $"DetallePedido_{detallePedido.PedidoId}.pdf");
            }
            catch (Exception ex)
            {
                // Aquí puedes hacer un logging del error
                return StatusCode(500, $"Error al generar el PDF: {ex.Message}");
            }
        }


        [HttpPut("EditarEstadoPedido")]
        public async Task<IActionResult> UpdateEstadoPedido([FromBody] ConfirmarPedidoCommand command, CancellationToken cancellationToken)
        {
            if (command == null || command.Pedidos == null || !command.Pedidos.Any())
            {
                return BadRequest("Error en la data al actualizar el estado de los pedidos");
            }
            var resultado = await mediator.Send(command, cancellationToken);

            if (resultado.Success)
            {
                return Ok(resultado);
            }

            return BadRequest(resultado);
        }

        // PUT: api/Pedido/EliminarPedido
        [HttpPut("EliminarPedido")]
        public async Task<IActionResult> DeletePedido([FromBody] EliminarPedidoCommand command, CancellationToken cancellationToken)
        {
            if (command == null || command.PedidoId == Guid.Empty)
            {
                return BadRequest("Error en la data");
            }
            var resultado = await mediator.Send(command, cancellationToken);

            if (resultado.Success)
            {
                return Ok(resultado);
            }

            return BadRequest(resultado);
        }
    }
}
