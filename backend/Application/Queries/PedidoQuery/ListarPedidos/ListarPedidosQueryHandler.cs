using backend.Data;
using backend.Helper;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace backend.Application.Queries.PedidoQuery.ListarPedidos
{
    public class ListarPedidosQueryHandler : IRequestHandler<ListarPedidosQuery, Paginacion<ListarPedidosDTO>>
    {
        private readonly InventarioDbContext _context;
        public ListarPedidosQueryHandler(InventarioDbContext context) 
        {
            _context = context;
        }
        public async Task<Paginacion<ListarPedidosDTO>> Handle(ListarPedidosQuery request, CancellationToken cancellationToken)
        {
            var query = _context.Pedidos
                .Where(p => p.DeletedAt == null)
                .OrderBy(p => p.CreatedAt)
                .AsQueryable();

            if (request.EstadoPedidoId != null)
            {
                query = query.Where(p => p.EstadoPedidoId == request.EstadoPedidoId);
            }

            if (!string.IsNullOrEmpty(request.Empresa))
            {
                query = query.Where(p =>
                    p.Cliente.RazonSocial.Contains(request.Empresa) ||
                    p.Cliente.Ruc.Contains(request.Empresa));
            }

            var totalItems = await query.CountAsync(cancellationToken);

            var data = await query
                .Include(c => c.Cliente)
                .Include(u => u.Usuario)
                .Select(x => new ListarPedidosDTO
                {
                    PedidoId = x.PedidoId,
                    UsuarioId = x.UsuarioId,
                    CreadoPor = x.Usuario.Nombre + " " + x.Usuario.Apellido,
                    ClienteId = x.ClienteId,
                    EstadoPedido = x.EstadoPedido.NombreEstadoPedido,
                    SeriePedido = x.SeriePedido,
                    Ruc = x.Cliente != null ? x.Cliente.Ruc : "",
                    RazonSocial = x.Cliente != null ? x.Cliente.RazonSocial : "",
                    FechaPedido = x.FechaPedido.ToString("dd/MM/yyyy"),
                    HoraPedido = x.FechaPedido.ToString("HH:mm"),

                    Igv = Math.Round(x.Igv, 2),
                    Iva = Math.Round(x.Iva, 2),
                    Total = x.Total,
                })
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync(cancellationToken);

            var totalPages = (int)Math.Ceiling((double)totalItems / request.PageSize);

            return new Paginacion<ListarPedidosDTO>
            {
                Items = data,
                TotalItems = totalItems,
                TotalPages = totalPages,
                CurrentPage = request.PageNumber
            };
        }
    }
}
