using backend.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace backend.Application.Queries.ProductoQuery.InventarioQuery
{
    public class ListarInventarioQueryHandler : IRequestHandler<ListarInventarioQuery, ListarInventarioDTO>
    {
        private readonly InventarioDbContext _context;
        public ListarInventarioQueryHandler(InventarioDbContext context) 
        {
            _context = context;
        }
        public async Task<ListarInventarioDTO> Handle(ListarInventarioQuery request, CancellationToken cancellationToken)
        {
            var pedidosPendientes = await _context.Pedidos
                .Where(p => p.DeletedAt == null && p.EstadoPedido.NombreEstadoPedido == "Pendiente")
                .CountAsync();

            var pedidosAprobados = await _context.Pedidos
                .Where(p => p.DeletedAt == null && p.EstadoPedido.NombreEstadoPedido == "Aprobado")
                .CountAsync();

            var totalProducto = await _context.Productos
                .Where(p => p.DeletedAt == null)
                .SumAsync(p => p.CantidadStock, cancellationToken);

            var totalInventario = await _context.Productos
                .Where(p => p.DeletedAt == null)
                .SumAsync(p => p.CantidadStock * p.Precio, cancellationToken);

            var promedioPrecio = await _context.Productos
                .Where(p => p.DeletedAt == null)
                .AverageAsync(p => p.Precio, cancellationToken);

            return new ListarInventarioDTO
            {
                CantidadPedidosPendientes = pedidosPendientes,
                CantidadPedidosAprobados = pedidosAprobados,
                TotalProducto = totalProducto,
                TotalInventario = Math.Round(totalInventario,2),
                PromedioInventario = Math.Round(promedioPrecio,2),
            };
        }
    }
}
