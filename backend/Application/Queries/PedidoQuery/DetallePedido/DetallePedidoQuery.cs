using MediatR;

namespace backend.Application.Queries.PedidoQuery.DetallePedido
{
    public class DetallePedidoQuery: IRequest<DetallePedidoDTO>
    {
        public Guid PedidoId { get; set; }
    }
}
