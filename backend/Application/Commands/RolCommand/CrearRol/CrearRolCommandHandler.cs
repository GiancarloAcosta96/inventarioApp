using backend.Data;
using backend.Helper;
using backend.Models.RolEntity;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace backend.Application.Commands.RolCommand.CrearRol
{
    public class CrearRolCommandHandler : IRequestHandler<CrearRolCommand, Response>
    {
        private readonly InventarioDbContext _context;
        public CrearRolCommandHandler(InventarioDbContext context)
        {
            _context = context;
        }
        public async Task<Response> Handle(CrearRolCommand request, CancellationToken cancellationToken)
        {
            try
            {
                TimeZoneInfo limaZone = TimeZoneInfo.FindSystemTimeZoneById("SA Pacific Standard Time");
                DateTime limaTime = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, limaZone);

                var rol = await _context.Roles
                    .AnyAsync(p => p.NombreRol == request.NombreRol);

                if (rol)
                {
                    throw new Exception("Este rol ya existe");
                }

                var data = new Rol
                {
                    NombreRol = request.NombreRol,
                    AccesoTotal = request.AccesoTotal,
                    CreatedAt = limaTime,
                };

                _context.Add(data);
                await _context.SaveChangesAsync();

                return new Response
                {
                    Success = true,
                    Title = "Rol creado",
                    Message = "Se creó el rol correctamente",
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
