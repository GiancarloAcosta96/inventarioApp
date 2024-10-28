using backend.Helper;
using MediatR;

namespace backend.Application.Commands.PedidoCommand.ConfirmarPedido
{
    public class ConfirmarPedidoCommand : IRequest<Response>
    {
        public List<PedidoUpdateDto> Pedidos { get; set; }
    }

    public class PedidoUpdateDto
    {
        public Guid PedidoId { get; set; }
        public Guid EstadoPedidoId { get; set; }
    }
}
