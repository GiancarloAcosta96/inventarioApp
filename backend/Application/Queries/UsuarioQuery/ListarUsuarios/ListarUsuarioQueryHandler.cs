using backend.Application.Queries.RolQuery.ListarRoles;
using backend.Data;
using backend.Helper;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace backend.Application.Queries.UsuarioQuery.ListarUsuarios
{
    public class ListarUsuarioQueryHandler : IRequestHandler<ListarUsuarioQuery, Paginacion<ListarUsuarioDTO>>
    {
        private readonly InventarioDbContext _context;
        public ListarUsuarioQueryHandler(InventarioDbContext context) 
        {
            _context = context;
        }
        public async Task<Paginacion<ListarUsuarioDTO>> Handle(ListarUsuarioQuery request, CancellationToken cancellationToken)
        {
            var query = _context.Usuarios
                .Where(p => p.DeletedAt == null)
                .OrderByDescending(p => p.CreatedAt)
                .AsQueryable();

            if (!string.IsNullOrEmpty(request.Datos))
            {
                query = query.Where(
                    p => (string.IsNullOrEmpty(request.Datos) || p.NombreUsuario.Contains(request.Datos))
                    || (string.IsNullOrEmpty(request.Datos) || p.Email.Contains(request.Datos))
                    );
            }

            var totalItems = await query.CountAsync(cancellationToken);

            var data = await query
                .Select(p => new ListarUsuarioDTO
                {
                    UsuarioId = p.UsuarioId,
                    Nombre = p.Nombre + " " + p.Apellido,
                    NombreUsuario = p.NombreUsuario,
                    Email = p.Email,
                    FechaRegistro = p.FechaRegistro.ToString("dd/MM/yyyy"),
                    UltimoAcceso = p.UltimoAcceso,
                    Rol = p.Rol.NombreRol
                })
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync(cancellationToken);

            var totalPages = (int)Math.Ceiling((double)totalItems / request.PageSize);

            return new Paginacion<ListarUsuarioDTO>
            {
                Items = data,
                TotalItems = totalItems,
                TotalPages = totalPages,
                CurrentPage = request.PageNumber
            };
        }
    }
}
