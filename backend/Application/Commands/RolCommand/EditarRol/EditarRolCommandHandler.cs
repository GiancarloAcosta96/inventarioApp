using backend.Application.Commands.ProductoCommand.EditarProducto;
using backend.Data;
using backend.Helper;
using MediatR;

namespace backend.Application.Commands.RolCommand.EditarRol
{
    public class EditarRolCommandHandler : IRequestHandler<EditarRolCommand, Response>
    {
        private readonly InventarioDbContext _context;
        public EditarRolCommandHandler(InventarioDbContext context) 
        {
            _context = context;
        }
        public async Task<Response> Handle(EditarRolCommand request, CancellationToken cancellationToken)
        {
            try
            {
                TimeZoneInfo limaZone = TimeZoneInfo.FindSystemTimeZoneById("SA Pacific Standard Time");
                DateTime limaTime = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, limaZone);

                var rolId = await _context.Roles.FindAsync(request.RolId);

                if (rolId == null)
                {
                    throw new Exception("Producto no encontrado");
                }

                rolId.RolId = request.RolId;
                rolId.NombreRol = request.NombreRol;
                rolId.AccesoTotal = request.AccesoTotal;
                rolId.UpdatedAt = limaTime;

                _context.Update(rolId);
                await _context.SaveChangesAsync();

                return new Response
                {
                    Success = true,
                    Title = "Rol editado",
                    Message = "Se editó el rol correctamente",
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
