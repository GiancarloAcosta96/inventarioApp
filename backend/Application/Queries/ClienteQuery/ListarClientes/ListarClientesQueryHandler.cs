using backend.Application.Queries.ProductoQuery.ListarProductos;
using backend.Data;
using backend.Helper;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace backend.Application.Queries.ClienteQuery.ListarClientes
{
    public class ListarClientesQueryHandler : IRequestHandler<ListarClientesQuery, Paginacion<ListarClientesDTO>>
    {
        private readonly InventarioDbContext _context;
        public ListarClientesQueryHandler(InventarioDbContext context)
        {
            _context = context;
        }
        public async Task<Paginacion<ListarClientesDTO>> Handle(ListarClientesQuery request, CancellationToken cancellationToken)
        {
            var query = _context.Clientes
                .Where(p => p.DeletedAt == null)
                .OrderByDescending(p => p.CreatedAt)
                .AsQueryable();

            if (!string.IsNullOrEmpty(request.Empresa))
            {
                query = query.Where(
                    p => (string.IsNullOrEmpty(request.Empresa) || p.Ruc.Contains(request.Empresa))
                    || (string.IsNullOrEmpty(request.Empresa) || p.RazonSocial.Contains(request.Empresa))
                    );
            }

            var totalItems = await query.CountAsync(cancellationToken);

            var data = await query
                .Select(p => new ListarClientesDTO
                {
                    ClienteId = p.ClienteId,
                    Ruc = p.Ruc,
                    RazonSocial = p.RazonSocial,
                    Direccion = p.Direccion,
                })
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync(cancellationToken);

            var totalPages = (int)Math.Ceiling((double)totalItems / request.PageSize);

            return new Paginacion<ListarClientesDTO>
            {
                Items = data,
                TotalItems = totalItems,
                TotalPages = totalPages,
                CurrentPage = request.PageNumber
            };
        }
    }
}
