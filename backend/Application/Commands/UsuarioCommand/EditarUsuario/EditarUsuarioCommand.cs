using backend.Helper;
using MediatR;

namespace backend.Application.Commands.UsuarioCommand.EditarUsuario
{
    public class EditarUsuarioCommand: IRequest<Response>
    {
        public Guid UsuarioId { get; set; }
        public string Nombre { get; set; }
        public string Apellido { get; set; }
        public string NombreUsuario { get; set; }
        public Guid RolId { get; set; }
    }
}
