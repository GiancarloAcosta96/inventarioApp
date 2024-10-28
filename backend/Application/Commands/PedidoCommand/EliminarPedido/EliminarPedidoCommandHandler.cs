using backend.Application.Commands.ProductoCommand.EliminarProducto;
using backend.Data;
using backend.Helper;
using MediatR;

namespace backend.Application.Commands.PedidoCommand.EliminarPedido
{
    public class EliminarPedidoCommandHandler : IRequestHandler<EliminarPedidoCommand, Response>
    {
        private InventarioDbContext _context;
        public EliminarPedidoCommandHandler(InventarioDbContext context) 
        {
            _context = context;
        }
        public async Task<Response> Handle(EliminarPedidoCommand request, CancellationToken cancellationToken)
        {
            try
            {
                TimeZoneInfo limaZone = TimeZoneInfo.FindSystemTimeZoneById("SA Pacific Standard Time");
                DateTime limaTime = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, limaZone);

                var pedidoId = await _context.Pedidos.FindAsync(request.PedidoId);

                if (pedidoId == null)
                {
                    throw new Exception("No se encontró el producto");
                }

                pedidoId.PedidoId = request.PedidoId;
                pedidoId.DeletedAt = limaTime;

                _context.Update(pedidoId);
                await _context.SaveChangesAsync();

                return new Response
                {
                    Success = true,
                    Title = "Pedido eliminado",
                    Message = "Se elimninó el pedido correctamente",
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
