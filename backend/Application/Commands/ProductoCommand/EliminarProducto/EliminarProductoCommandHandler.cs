using backend.Data;
using backend.Helper;
using MediatR;

namespace backend.Application.Commands.ProductoCommand.EliminarProducto
{
    public class EliminarProductoCommandHandler : IRequestHandler<EliminarProductoCommand, Response>
    {
        private readonly InventarioDbContext _context;
        public EliminarProductoCommandHandler(InventarioDbContext context) 
        {
            _context = context;
        }
        public async Task<Response> Handle(EliminarProductoCommand request, CancellationToken cancellationToken)
        {
            try
            {
                TimeZoneInfo limaZone = TimeZoneInfo.FindSystemTimeZoneById("SA Pacific Standard Time");
                DateTime limaTime = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, limaZone);

                var productoId = await _context.Productos.FindAsync(request.ProductoId);

                if (productoId == null)
                {
                    throw new Exception("No se encontró el producto");
                }

                productoId.ProductoId = request.ProductoId;
                productoId.DeletedAt = limaTime;

                _context.Update(productoId);
                await _context.SaveChangesAsync();

                return new Response
                {
                    Success = true,
                    Title = "Producto eliminado",
                    Message = "Se elimninó el producto correctamente",
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
