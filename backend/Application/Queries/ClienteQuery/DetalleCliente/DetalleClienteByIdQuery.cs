using backend.Application.Queries.ProductoQuery.DetalleProducto;
using MediatR;

namespace backend.Application.Queries.ClienteQuery.DetalleCliente
{
    public class DetalleClienteByIdQuery : IRequest<DetalleClienteByIdDTO>
    {
        public Guid ClienteId { get; set; }
    }
}
