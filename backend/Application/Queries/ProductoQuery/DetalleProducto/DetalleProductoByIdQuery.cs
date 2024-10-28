using MediatR;

namespace backend.Application.Queries.ProductoQuery.DetalleProducto
{
    public class DetalleProductoByIdQuery: IRequest<DetalleProductoByIdDTO>
    {
        public Guid ProductoId {  get; set; }
    }
}
