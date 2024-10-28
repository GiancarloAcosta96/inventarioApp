using backend.Application.Queries.ProductoQuery.DetalleProducto;
using backend.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace backend.Application.Queries.UsuarioQuery.DetalleUsuario
{
    public class DetalleUsuarioByIdQueryHandler : IRequestHandler<DetalleUsuarioByIdQuery, DetalleUsuarioByIdDTO>
    {
        private readonly InventarioDbContext _context;
        public DetalleUsuarioByIdQueryHandler(InventarioDbContext context) 
        {
            _context = context;
        }
        public async Task<DetalleUsuarioByIdDTO> Handle(DetalleUsuarioByIdQuery request, CancellationToken cancellationToken)
        {
            var usuario = await _context.Usuarios
                .Where(p => p.UsuarioId == request.UsuarioId)
                .Select(p => new DetalleUsuarioByIdDTO
                {
                    UsuarioId = p.UsuarioId,
                    Nombre = p.Nombre,
                    Apellido = p.Apellido, 
                    NombreUsuario = p.NombreUsuario,
                    Email = p.Email,
                    FechaRegistro = p.FechaRegistro.ToString("dd-MM-yyyy"),
                    RolId = p.RolId,
                    Rol = p.Rol.NombreRol,
                }).FirstOrDefaultAsync(cancellationToken);

            if (usuario == null)
            {
                throw new Exception("Producto no encontrado");
            }

            return usuario;
        }
    }
}
