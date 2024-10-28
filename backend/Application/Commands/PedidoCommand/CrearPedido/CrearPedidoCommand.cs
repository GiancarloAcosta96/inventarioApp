using backend.Helper;
using MediatR;

namespace backend.Application.Commands.PedidoCommand.CrearPedido
{
    public class CrearPedidoCommand: IRequest<Response>
    {
        public Guid UsuarioId { get; set; }
        public Guid ClienteId { get; set; }
        public string FechaPedido { get; set; }
        public List<ProductosPedidos> Productos {  get; set; }
    }
    public class ProductosPedidos
    {
        public Guid ProductoId { get; set; }
        public int Cantidad { get; set; }
    }
}
