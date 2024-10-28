using backend.Helper;
using MediatR;

namespace backend.Application.Commands.RolCommand.CrearRol
{
    public class CrearRolCommand : IRequest<Response>
    {
        public string NombreRol { get; set; }
        public int AccesoTotal { get; set; }
    }
}
