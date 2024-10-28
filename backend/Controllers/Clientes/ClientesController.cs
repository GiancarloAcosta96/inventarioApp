using backend.Application.Commands.ClienteCommand.CrearCliente;
using backend.Application.Commands.ClienteCommand.EditarCliente;
using backend.Application.Commands.ClienteCommand.EliminarCliente;
using backend.Application.Queries.ClienteQuery.DetalleCliente;
using backend.Application.Queries.ClienteQuery.ListarClientes;
using backend.Application.Queries.ClienteQuery.ListarClientesCombo;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers.Clientes
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClientesController: ControllerBase
    {
        private readonly IMediator mediator;
        public ClientesController(IMediator mediator)
        {
            this.mediator = mediator;
        }

        // GET: api/Cliente/ListarClientes
        [HttpGet("ListarClientes")]
        public async Task<IActionResult> GetClientes([FromQuery] string? empresa, int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            var query = new ListarClientesQuery
            {
                Empresa = empresa,
                PageNumber = pageNumber,
                PageSize = pageSize
            };

            var result = await mediator.Send(query);
            return Ok(result);
        }

        // GET: api/Cliente/ListarClientes
        [HttpGet("ListarClientesCombo")]
        public async Task<IActionResult> GetClientesCombo([FromQuery] string? empresa)
        {
            var query = new ListarClienteComboQuery
            {
                Empresa = empresa,
            };

            var result = await mediator.Send(query);
            return Ok(result);
        }

        // POST: api/Cliente
        [HttpPost("CrearCliente")]
        public async Task<IActionResult> CreateCliente([FromBody] CrearClienteCommand command, CancellationToken cancellationToken)
        {
            if (command == null)
            {
                return BadRequest("Error en la data al crear Cliente");
            }
            var resultado = await mediator.Send(command, cancellationToken);

            if (resultado.Success)
            {
                return Ok(resultado);
            }

            return BadRequest(resultado);
        }

        // Get: Obtener cliente by id
        [HttpGet("ObtenerClienteById")]
        public async Task<IActionResult> GetClienteDetalle(Guid clienteId)
        {
            var query = new DetalleClienteByIdQuery { ClienteId = clienteId };
            var detalleCliente = await mediator.Send(query);
            return Ok(detalleCliente);
        }

        // PUT: api/Cliente/EditarCliente
        [HttpPut("EditarCliente")]
        public async Task<IActionResult> UpdateCliente([FromBody] EditarClienteCommand command, CancellationToken cancellationToken)
        {
            if (command == null || command.ClienteId == Guid.Empty)
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

        // PUT: api/Cliente/EliminarClinete
        [HttpPut("EliminarCliente")]
        public async Task<IActionResult> DeleteCliente([FromBody] EliminarClienteCommand command, CancellationToken cancellationToken)
        {
            if (command == null || command.ClienteId == Guid.Empty)
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
