using backend.Helper;
using MediatR;

namespace backend.Application.Commands.ClienteCommand.EditarCliente
{
    public class EditarClienteCommand : IRequest<Response>
    {
        public Guid ClienteId { get; set; }
        public string Ruc { get; set; }
        public string RazonSocial { get; set; }
        public string Direccion { get; set; }
    }
}
