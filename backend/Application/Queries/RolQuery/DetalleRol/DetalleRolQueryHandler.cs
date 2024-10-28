using backend.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace backend.Application.Queries.RolQuery.DetalleRol
{
    public class DetalleRolQueryHandler : IRequestHandler<DetalleRolQuery, DetalleRolDTO>
    {
        private readonly InventarioDbContext _context;
        public DetalleRolQueryHandler(InventarioDbContext context) 
        {
            _context = context;
        }
        public async Task<DetalleRolDTO> Handle(DetalleRolQuery request, CancellationToken cancellationToken)
        {
            var usuario = await _context.Roles
                .Where(p => p.RolId == request.RolId)
                .Select(p => new DetalleRolDTO
                {
                    RolId = p.RolId,
                    NombreRol = p.NombreRol,
                    AccesoTotal = p.AccesoTotal,
                }).FirstOrDefaultAsync(cancellationToken);

            if (usuario == null)
            {
                throw new Exception("Rol no encontrado");
            }

            return usuario;
        }
    }
}
