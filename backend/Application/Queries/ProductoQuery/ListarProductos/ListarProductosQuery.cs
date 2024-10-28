using backend.Helper;
using MediatR;

namespace backend.Application.Queries.ProductoQuery.ListarProductos
{
    public class ListarProductosQuery: IRequest<Paginacion<ListarProductosDTO>>
    {
        public string? NombreProducto { get; set; }
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }
}
