using backend.Helper;
using MediatR;

namespace backend.Application.Commands.ProductoCommand.EliminarProducto
{
    public class EliminarProductoCommand: IRequest<Response>
    {
        public Guid ProductoId { get; set; }
    }
}
