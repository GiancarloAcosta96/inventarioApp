using backend.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace backend.Application.Queries.ProductoQuery.DetalleProducto
{
    public class DetalleProductoByIdQueryHandler : IRequestHandler<DetalleProductoByIdQuery, DetalleProductoByIdDTO>
    {
        private readonly InventarioDbContext _context;
        public DetalleProductoByIdQueryHandler(InventarioDbContext context) 
        {
            _context = context;
        }
        public async Task<DetalleProductoByIdDTO> Handle(DetalleProductoByIdQuery request, CancellationToken cancellationToken)
        {
            var producto = await _context.Productos
                .Where(p => p.ProductoId == request.ProductoId)
                .Select(p => new DetalleProductoByIdDTO
                {
                    ProductoId = p.ProductoId,
                    NombreProducto = p.NombreProducto,
                    Descripcion = p.Descripcion,
                    Precio = p.Precio,
                    CantidadStock = p.CantidadStock,
                }).FirstOrDefaultAsync(cancellationToken);

            if (producto == null)
            {
                throw new Exception("Producto no encontrado");
            }

            return producto;
        }
    }
}
