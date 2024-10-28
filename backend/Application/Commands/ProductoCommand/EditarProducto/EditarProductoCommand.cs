using backend.Helper;
using MediatR;

namespace backend.Application.Commands.ProductoCommand.EditarProducto
{
    public class EditarProductoCommand: IRequest<Response>
    {
        public Guid ProductoId {  get; set; }
        public string NombreProducto {  get; set; }
        public string Descripcion {  get; set; }
        public double Precio { get; set; }
        public int CantidadStock { get; set; }
    }
}
