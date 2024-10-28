using backend.Application.Commands.ProductoCommand.EditarProducto;
using backend.Data;
using backend.Helper;
using MediatR;

namespace backend.Application.Commands.UsuarioCommand.EditarUsuario
{
    public class EditarUsuarioCommandHandler : IRequestHandler<EditarUsuarioCommand, Response>
    {
        private readonly InventarioDbContext _context;
        public EditarUsuarioCommandHandler(InventarioDbContext context) 
        {
            _context = context;
        }
        public async Task<Response> Handle(EditarUsuarioCommand request, CancellationToken cancellationToken)
        {
            try
            {
                TimeZoneInfo limaZone = TimeZoneInfo.FindSystemTimeZoneById("SA Pacific Standard Time");
                DateTime limaTime = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, limaZone);

                var usuarioId = await _context.Usuarios.FindAsync(request.UsuarioId);

                if (usuarioId == null)
                {
                    throw new Exception("Usuario no encontrado");
                }

                usuarioId.UsuarioId = request.UsuarioId;
                usuarioId.Nombre = request.Nombre;
                usuarioId.Apellido = request.Apellido;
                usuarioId.NombreUsuario = request.NombreUsuario;
                usuarioId.RolId = request.RolId;
                usuarioId.UpdatedAt = limaTime;

                _context.Update(usuarioId);
                await _context.SaveChangesAsync();

                return new Response
                {
                    Success = true,
                    Title = "Usuario editado",
                    Message = "Se editó el usuario correctamente",
                };
            }
            catch (Exception ex)
            {
                return new Response
                {
                    Success = false,
                    Title = "Error inesperado",
                    Message = $"Ocurrió un error inesperado: {ex.Message}"
                };
            }
        }
    }
}
