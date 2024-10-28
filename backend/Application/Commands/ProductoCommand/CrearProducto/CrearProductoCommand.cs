using backend.Helper;
using MediatR;

namespace backend.Application.Commands.ProductoCommand.CrearProducto
{
    public class CrearProductoCommand : IRequest<Response>
    {
        public string NombreProducto { get; set; }
        public string Descripcion { get; set; }
        public double Precio { get; set; }
        public int CantidadStock { get; set; }
    }
}
