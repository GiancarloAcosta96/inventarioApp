using backend.Helper;
using MediatR;

namespace backend.Application.Queries.PedidoQuery.ListarPedidos
{
    public class ListarPedidosQuery: IRequest<Paginacion<ListarPedidosDTO>>
    {
        public Guid? EstadoPedidoId { get; set; }
        public string? Empresa { get; set; }
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }
}
