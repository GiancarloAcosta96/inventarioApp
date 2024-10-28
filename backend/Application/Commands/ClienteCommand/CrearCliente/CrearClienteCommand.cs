using backend.Helper;
using MediatR;

namespace backend.Application.Commands.ClienteCommand.CrearCliente
{
    public class CrearClienteCommand: IRequest<Response>
    {
        public string Ruc {  get; set; }
        public string RazonSocial { get; set; }
        public string Direccion {  get; set; }
    }
}
