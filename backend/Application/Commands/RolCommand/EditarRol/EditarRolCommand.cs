using backend.Helper;
using MediatR;

namespace backend.Application.Commands.RolCommand.EditarRol
{
    public class EditarRolCommand: IRequest<Response>
    {
        public Guid RolId { get; set; }
        public string NombreRol { get; set; }
        public int AccesoTotal { get; set; }
    }
}
