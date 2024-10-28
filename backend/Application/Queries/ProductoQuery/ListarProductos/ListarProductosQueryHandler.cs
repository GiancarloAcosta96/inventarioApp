using backend.Data;
using backend.Helper;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace backend.Application.Queries.ProductoQuery.ListarProductos
{
    public class ListarProductosQueryHandler : IRequestHandler<ListarProductosQuery, Paginacion<ListarProductosDTO>>
    {
        private readonly InventarioDbContext _context;
        public ListarProductosQueryHandler(InventarioDbContext context) 
        {
            _context = context;
        }
        public async Task<Paginacion<ListarProductosDTO>> Handle(ListarProductosQuery request, CancellationToken cancellationToken)
        {
            var query = _context.Productos
                .Where(p => p.DeletedAt == null && p.CantidadStock > 0)
                .OrderByDescending(p => p.CreatedAt)
                .AsQueryable();

            if (!string.IsNullOrEmpty(request.NombreProducto)) 
            {
                query = query.Where(p => string.IsNullOrEmpty(request.NombreProducto) 
                || p.NombreProducto.Contains(request.NombreProducto));
            }

            var totalItems = await query.CountAsync(cancellationToken);

            var data = await query
                .Select(p => new ListarProductosDTO
                {
                    ProductoId = p.ProductoId,
                    NombreProducto = p.NombreProducto,
                    Descripcion = p.Descripcion,
                    Precio = p.Precio,
                    CantidadStock = p.CantidadStock,
                })
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync(cancellationToken);

            var totalPages = (int)Math.Ceiling((double)totalItems / request.PageSize);

            return new Paginacion<ListarProductosDTO>
            {
                Items = data,
                TotalItems = totalItems,
                TotalPages = totalPages,
                CurrentPage = request.PageNumber
            };
        }
    }
}
