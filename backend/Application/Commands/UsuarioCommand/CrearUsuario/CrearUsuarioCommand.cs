using backend.Helper;
using MediatR;

namespace backend.Application.Commands.UsuarioCommand.CrearUsuario
{
    public class CrearUsuarioCommand: IRequest<Response>
    {
        public string NombreUsuario { get; set; }
        public string Nombre {  get; set; }
        public string Apellido { get; set; }
        public string Email { get; set; }
        public string Password {  get; set; }
        public Guid RolId {  get; set; }
    }
}
