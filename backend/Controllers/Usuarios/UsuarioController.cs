using backend.Application.Commands.ProductoCommand.EditarProducto;
using backend.Application.Commands.UsuarioCommand.CrearUsuario;
using backend.Application.Commands.UsuarioCommand.EditarUsuario;
using backend.Application.Queries.PedidoQuery.ListarPedidos;
using backend.Application.Queries.ProductoQuery.DetalleProducto;
using backend.Application.Queries.UsuarioQuery.DetalleUsuario;
using backend.Application.Queries.UsuarioQuery.ListarUsuarios;
using MediatR;
using Microsoft.AspNetCore.Components.Forms;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers.Usuarios
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsuarioController: ControllerBase
    {
        private readonly IMediator _mediator;
        public UsuarioController(IMediator mediator)
        {
            this._mediator = mediator;
        }

        // GET: api/Usuarios/ListarUsuarios
        [HttpGet("ListarUsuarios")]
        public async Task<IActionResult> GetUsuarios([FromQuery] string? datos, int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            var query = new ListarUsuarioQuery
            {
                Datos = datos,
                PageNumber = pageNumber,
                PageSize = pageSize
            };

            var result = await _mediator.Send(query);
            return Ok(result);
        }

        // POST: api/Usuario
        [HttpPost]
        public async Task<IActionResult> CreateUsuario([FromBody] CrearUsuarioCommand command, CancellationToken cancellationToken)
        {
            if (command == null)
            {
                return BadRequest("Error en la data al crear Usuario");
            }
            var resultado = await _mediator.Send(command, cancellationToken);

            if (resultado.Success)
            {
                return Ok(resultado);
            }

            return BadRequest(resultado);
        }

        // Get: Obtener usuario by id
        [HttpGet("ObtenerUsuarioById")]
        public async Task<IActionResult> GetUsuarioDetalle(Guid usuarioId)
        {
            var query = new DetalleUsuarioByIdQuery { UsuarioId = usuarioId };
            var detalleUsuario = await _mediator.Send(query);
            return Ok(detalleUsuario);
        }

        // PUT: api/Usuario/EditarUsuario
        [HttpPut("EditarUsuario")]
        public async Task<IActionResult> UpdateUsuario([FromBody] EditarUsuarioCommand command, CancellationToken cancellationToken)
        {
            if (command == null || command.UsuarioId == Guid.Empty)
            {
                return BadRequest("Error en la data al editar Usuario");
            }
            var resultado = await _mediator.Send(command, cancellationToken);

            if (resultado.Success)
            {
                return Ok(resultado);
            }

            return BadRequest(resultado);
        }
    }
}
