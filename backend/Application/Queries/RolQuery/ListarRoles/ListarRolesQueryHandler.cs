using backend.Data;
using backend.Helper;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace backend.Application.Queries.RolQuery.ListarRoles
{
    public class ListarRolesQueryHandler : IRequestHandler<ListarRolesQuery, Paginacion<ListarRolesDTO>>
    {
        private readonly InventarioDbContext _context;
        public ListarRolesQueryHandler(InventarioDbContext context) 
        {
            _context = context;
        }
        public async Task<Paginacion<ListarRolesDTO>> Handle(ListarRolesQuery request, CancellationToken cancellationToken)
        {
            var query = _context.Roles
                .Where(p => p.DeletedAt == null)
                .OrderByDescending(p => p.CreatedAt)
                .AsQueryable();

            if (!string.IsNullOrEmpty(request.NombreRol))
            {
                query = query.Where(p => string.IsNullOrEmpty(request.NombreRol)
                || p.NombreRol.Contains(request.NombreRol));
            }

            var totalItems = await query.CountAsync(cancellationToken);

            var data = await query
                .Select(p => new ListarRolesDTO
                {
                    RolId = p.RolId,
                    NombreRol = p.NombreRol,
                    AccesoTotal = p.AccesoTotal
                })
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync(cancellationToken);

            var totalPages = (int)Math.Ceiling((double)totalItems / request.PageSize);

            return new Paginacion<ListarRolesDTO>
            {
                Items = data,
                TotalItems = totalItems,
                TotalPages = totalPages,
                CurrentPage = request.PageNumber
            };
        }
    }
}
