using backend.Data;
using backend.Helper;
using backend.Models.PedidoEntity;
using MediatR;

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

                var pedidosToUpdate = new List<Pedido>();

                foreach (var pedidoDto in request.Pedidos)
                {
                    var pedido = await _context.Pedidos.FindAsync(pedidoDto.PedidoId);

                    if (pedido == null)
                    {
                        throw new Exception($"No se encontró el pedido con ID: {pedidoDto.PedidoId}");
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
