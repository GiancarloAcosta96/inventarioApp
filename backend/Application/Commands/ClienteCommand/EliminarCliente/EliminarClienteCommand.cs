using MediatR;

namespace backend.Application.Commands.ClienteCommand.EliminarCliente
{
    public class EliminarClienteCommand : IRequest<Unit>
    {
        public Guid ClienteId { get; set; }
    }
}
