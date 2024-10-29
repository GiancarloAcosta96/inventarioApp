using backend.Data;
using backend.Helper;
using backend.Models.PedidoEntity;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace backend.Application.Commands.PedidoCommand.ConfirmarPedido
{
    public class ConfirmarPedidoCommandHandler : IRequestHandler<ConfirmarPedidoCommand, Response>
    {
        private readonly InventarioDbContext _context;

        public ConfirmarPedidoCommandHandler(InventarioDbContext context)
        {
            _context = context;
        }

        public async Task<Response> Handle(ConfirmarPedidoCommand request, CancellationToken cancellationToken)
        {
            try
            {
                TimeZoneInfo limaZone = TimeZoneInfo.FindSystemTimeZoneById("SA Pacific Standard Time");
                DateTime limaTime = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, limaZone);

                var estadoAprobado = await _context.EstadoPedidos
                    .FirstOrDefaultAsync(e => e.NombreEstadoPedido == "Aprobado" && e.DeletedAt == null, cancellationToken);

                if (estadoAprobado == null)
                {
                    throw new Exception("El estado 'Aprobado' no se encontró.");
                }

                var pedidosToUpdate = new List<Pedido>();

                foreach (var pedidoDto in request.Pedidos)
                {
                    var pedido = await _context.Pedidos.FindAsync(pedidoDto.PedidoId);

                    if (pedido == null)
                    {
                        throw new Exception($"No se encontró el pedido con ID: {pedidoDto.PedidoId}");
                    }

                    if (pedidoDto.EstadoPedidoId == estadoAprobado.EstadoPedidoId)
                    {
                        var detallesPedido = await _context.DetallePedidos
                            .Where(dp => dp.PedidoId == pedidoDto.PedidoId)
                            .ToListAsync(cancellationToken);

                        foreach (var detalle in detallesPedido)
                        {
                            var producto = await _context.Productos.FindAsync(detalle.ProductoId);
                            if (producto != null)
                            {

                                if (producto.CantidadStock < detalle.Cantidad)
                                {
                                    throw new Exception($"No hay suficiente stock para el producto: {producto.NombreProducto}");
                                }

                                producto.CantidadStock -= detalle.Cantidad;
                                _context.Productos.Update(producto);
                            }
                        }
                    }
                    pedido.EstadoPedidoId = pedidoDto.EstadoPedidoId;
                    pedido.UpdatedAt = limaTime;

                    pedidosToUpdate.Add(pedido);
                }

                _context.UpdateRange(pedidosToUpdate);
                await _context.SaveChangesAsync();

                return new Response
                {
                    Success = true,
                    Title = "Estados actualizados",
                    Message = "Se actualizaron los estados de los pedidos",
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
