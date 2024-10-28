using backend.Application.Queries.ProductoQuery.ListarProductos;
using backend.Helper;
using MediatR;

namespace backend.Application.Queries.ClienteQuery.ListarClientes
{
    public class ListarClientesQuery : IRequest<Paginacion<ListarClientesDTO>>
    {
        public string? Empresa { get; set; }
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }
}
