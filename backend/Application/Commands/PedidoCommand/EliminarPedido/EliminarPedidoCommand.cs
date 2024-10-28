using backend.Helper;
using MediatR;

namespace backend.Application.Commands.PedidoCommand.EliminarPedido
{
    public class EliminarPedidoCommand: IRequest<Response>
    {
        public Guid PedidoId { get; set; }
    }
}
