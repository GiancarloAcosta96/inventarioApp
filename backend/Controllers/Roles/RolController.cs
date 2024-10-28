using backend.Application.Commands.RolCommand.CrearRol;
using backend.Application.Commands.RolCommand.EditarRol;
using backend.Application.Commands.RolCommand.EliminarRol;
using backend.Application.Queries.ProductoQuery.DetalleProducto;
using backend.Application.Queries.RolQuery.DetalleRol;
using backend.Application.Queries.RolQuery.ListarRoles;
using backend.Application.Queries.RolQuery.ListarRolesCombo;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers.Roles
{
    [Route("api/[controller]")]
    [ApiController]
    public class RolController: ControllerBase
    {
        private readonly IMediator mediator;
        public RolController(IMediator mediator)
        {
            this.mediator = mediator;
        }

        // GET: api/Rol/Listarroles
        [HttpGet("ListarRoles")]
        public async Task<IActionResult> GetRoles([FromQuery] string? nombreRol, int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            var query = new ListarRolesQuery
            {
                NombreRol = nombreRol,
                PageNumber = pageNumber,
                PageSize = pageSize
            };

            var result = await mediator.Send(query);
            return Ok(result);
        }

        //GET api/Rol/ListarRolesCombo
        [HttpGet("ListarRolesCombo")]
        public async Task<IActionResult> GetRolesCombo()
        {
            var query = new ListarRolesComboQuery();

            var result = await mediator.Send(query);
            return Ok(result);
        }

        // POST: api/Rol/CrearRol
        [HttpPost("CrearRol")]
        public async Task<IActionResult> CreateRol([FromBody] CrearRolCommand command, CancellationToken cancellationToken)
        {
            if (command == null)
            {
                return BadRequest("Error en la data al crear Rol");
            }
            var resultado = await mediator.Send(command, cancellationToken);

            if (resultado.Success)
            {
                return Ok(resultado);
            }

            return BadRequest(resultado);
        }

        // Get: Obtener rol by id
        [HttpGet("ObtenerRolById")]
        public async Task<IActionResult> GetRolDetalle(Guid rolId)
        {
            var query = new DetalleRolQuery { RolId = rolId };
            var detalleRol = await mediator.Send(query);
            return Ok(detalleRol);
        }

        // PUT: api/Rol/EditarRol
        [HttpPut("EditarRol")]
        public async Task<IActionResult> UpdateRol([FromBody] EditarRolCommand command, CancellationToken cancellationToken)
        {
            if (command == null || command.RolId == Guid.Empty)
            {
                return BadRequest("Error en la data al editar Rol");
            }
            var resultado = await mediator.Send(command, cancellationToken);

            if (resultado.Success)
            {
                return Ok(resultado);
            }

            return BadRequest(resultado);
        }

        // PUT: api/Rol/EliminarRol
        [HttpPut("EliminarRol")]
        public async Task<IActionResult> DeleteRol([FromBody] EliminarRolCommand command, CancellationToken cancellationToken)
        {
            if (command == null || command.RolId == Guid.Empty)
            {
                return BadRequest("Error en la data");
            }
            try
            {
                await mediator.Send(command, cancellationToken);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
