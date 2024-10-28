using backend.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace backend.Application.Queries.PedidoQuery.DetallePedido
{
    public class DetallePedidoQueryHandler : IRequestHandler<DetallePedidoQuery, DetallePedidoDTO>
    {
        private readonly InventarioDbContext _context;
        public DetallePedidoQueryHandler(InventarioDbContext context) 
        {
            _context = context;
        }
        public async Task<DetallePedidoDTO> Handle(DetallePedidoQuery request, CancellationToken cancellationToken)
        {
            var pedido = await _context.Pedidos
                .Include(e => e.EstadoPedido)
                .Include(c => c.Cliente)
                .Include(u => u.Usuario)
                .Where (p => p.PedidoId == request.PedidoId)
                .Select(p => new DetallePedidoDTO {
                    PedidoId = p.PedidoId,
                    Ruc = p.Cliente.Ruc,
                    Estado = p.EstadoPedido.NombreEstadoPedido,
                    FechaPedido = p.FechaPedido.ToString("dd-MM-yyyy"),
                    RegistradoPor = p.Usuario.Nombre + " " + p.Usuario.Apellido,
                    SeriePedido = p.SeriePedido,
                    RazonSocial = p.Cliente.RazonSocial,
                    Direccion = p.Cliente.Direccion,
                    Igv = Math.Round(p.Igv, 2),
                    Iva = Math.Round(p.Iva, 2),
                    Total = p.Total,
                    Productos = p.DetallePedidos.Select(pd => new ProductoPedidoDTO
                    {
                        NombreProducto = pd.Producto.NombreProducto,
                        Cantidad = pd.Cantidad,
                        Precio = pd.PrecioUnitario,
                    }).ToList(),
                }).FirstOrDefaultAsync(cancellationToken);

            return pedido;
        }
    }
}
