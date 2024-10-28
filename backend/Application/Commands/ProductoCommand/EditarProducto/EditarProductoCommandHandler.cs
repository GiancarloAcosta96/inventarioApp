using backend.Data;
using backend.Helper;
using MediatR;

namespace backend.Application.Commands.ProductoCommand.EditarProducto
{
    public class EditarProductoCommandHandler : IRequestHandler<EditarProductoCommand, Response>
    {
        private readonly InventarioDbContext _context;
        public EditarProductoCommandHandler(InventarioDbContext context) 
        {
            _context = context;
        }
        public async Task<Response> Handle(EditarProductoCommand request, CancellationToken cancellationToken)
        {
            try
            {
                TimeZoneInfo limaZone = TimeZoneInfo.FindSystemTimeZoneById("SA Pacific Standard Time");
                DateTime limaTime = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, limaZone);

                var productoId = await _context.Productos.FindAsync(request.ProductoId);

                if (productoId == null)
                {
                    throw new Exception("Producto no encontrado");
                }

                productoId.ProductoId = request.ProductoId;
                productoId.NombreProducto = request.NombreProducto;
                productoId.Descripcion = request.Descripcion;
                productoId.Precio = request.Precio;
                productoId.CantidadStock = request.CantidadStock;
                productoId.UpdatedAt = limaTime;

                _context.Update(productoId);
                await _context.SaveChangesAsync();

                return new Response
                {
                    Success = true,
                    Title = "Producto editado",
                    Message = "Se editó el producto correctamente",
                };
            }
            catch (Exception ex) 
            {
                return new Response
                {
                    Success = false,
                    Title = "Error inesperado",
                    Message = $"Ocurrió un error inesperado: {ex.Message}"
                };
            }
        }
    }
}
