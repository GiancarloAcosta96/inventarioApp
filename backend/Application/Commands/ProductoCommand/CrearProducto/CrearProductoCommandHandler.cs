using backend.Data;
using backend.Helper;
using backend.Models.ProductoEntity;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace backend.Application.Commands.ProductoCommand.CrearProducto
{
    public class CrearProductoCommandHandler : IRequestHandler<CrearProductoCommand, Response>
    {
        private readonly InventarioDbContext _context;
        public CrearProductoCommandHandler(InventarioDbContext context)
        {
            _context = context;
        }
        public async Task<Response> Handle(CrearProductoCommand request, CancellationToken cancellationToken)
        {
            try
            {
                TimeZoneInfo limaZone = TimeZoneInfo.FindSystemTimeZoneById("SA Pacific Standard Time");
                DateTime limaTime = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, limaZone);

                var producto = await _context.Productos
                    .AnyAsync(p => p.NombreProducto == request.NombreProducto && p.DeletedAt == null);

                if (producto)
                {
                    return new Response
                    {
                        Success = false,
                        Title = "Error al crear producto",
                        Message = "El nombre del producto ya existe."
                    };
                }

                var data = new Producto
                {
                    NombreProducto = request.NombreProducto,
                    Descripcion = request.Descripcion,
                    Precio = request.Precio,
                    CantidadStock = request.CantidadStock,
                    CreatedAt = limaTime,
                };

                _context.Add(data);
                await _context.SaveChangesAsync();

                return new Response
                {
                    Success = true,
                    Title = "Producto creado",
                    Message = "Se registró el producto correctamente",
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
