using backend.Application.Commands.ProductoCommand.CrearProducto;
using backend.Application.Commands.ProductoCommand.EditarProducto;
using backend.Application.Commands.ProductoCommand.EliminarProducto;
using backend.Application.Queries.ProductoQuery.DetalleProducto;
using backend.Application.Queries.ProductoQuery.InventarioQuery;
using backend.Application.Queries.ProductoQuery.ListarProductos;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers.Productos
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductoController: ControllerBase
    {
        private readonly IMediator mediator;
        public ProductoController(IMediator mediator)
        {
            this.mediator = mediator;
        }

        // GET: api/Producto/ListarProductos
        [HttpGet("ListarProductos")]
        public async Task<IActionResult> GetProductos([FromQuery] string? nombreProducto, int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            var query = new ListarProductosQuery
            {
                NombreProducto = nombreProducto,
                PageNumber = pageNumber,
                PageSize = pageSize
            };

            var result = await mediator.Send(query);
            return Ok(result);
        }

        // POST: api/Producto
        [HttpPost("CrearProducto")]
        public async Task<IActionResult> CreateProducto([FromBody] CrearProductoCommand command, CancellationToken cancellationToken)
        {
            if (command == null)
            {
                return BadRequest("Error en la data al crear Producto");
            }
            var resultado = await mediator.Send(command, cancellationToken);

            if (resultado.Success)
            {
                return Ok(resultado);
            }

            return BadRequest(resultado);
        }

        // Get: Obtener producto by id
        [HttpGet("ObtenerProductoById")]
        public async Task<IActionResult> GetProductoDetalle(Guid productoId)
        {
            var query = new DetalleProductoByIdQuery { ProductoId = productoId };
            var detalleProducto = await mediator.Send(query);
            return Ok(detalleProducto);
        }

        // PUT: api/Producto/EditarProducto
        [HttpPut("EditarProducto")]
        public async Task<IActionResult> UpdateProducto([FromBody] EditarProductoCommand command, CancellationToken cancellationToken)
        {
            if (command == null || command.ProductoId == Guid.Empty)
            {
                return BadRequest("Error en la data al editar Producto");
            }
            var resultado = await mediator.Send(command, cancellationToken);

            if (resultado.Success)
            {
                return Ok(resultado);
            }

            return BadRequest(resultado);
        }

        // PUT: api/Producto/EliminarProducto
        [HttpPut("EliminarProducto")]
        public async Task<IActionResult> DeleteProducto([FromBody] EliminarProductoCommand command, CancellationToken cancellationToken)
        {
            if (command == null || command.ProductoId == Guid.Empty)
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

        // GET: api/Producto/Inventario
        [HttpGet("Inventario")]
        public async Task<IActionResult> GetInventario(CancellationToken cancellationToken)
        {
            var query = new ListarInventarioQuery();
            var result = await mediator.Send(query, cancellationToken);
            return Ok(result);
        }
    }
}
