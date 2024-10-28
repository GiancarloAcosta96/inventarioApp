using backend.Application.Queries.ProductoQuery.DetalleProducto;
using backend.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace backend.Application.Queries.ClienteQuery.DetalleCliente
{
    public class DetalleClienteByIdQueryHandler : IRequestHandler<DetalleClienteByIdQuery, DetalleClienteByIdDTO>
    {
        private readonly InventarioDbContext _context;
        public DetalleClienteByIdQueryHandler(InventarioDbContext context)
        {
            _context = context;
        }
        public async Task<DetalleClienteByIdDTO> Handle(DetalleClienteByIdQuery request, CancellationToken cancellationToken)
        {
            var cliente = await _context.Clientes
                .Where(p => p.ClienteId == request.ClienteId)
                .Select(p => new DetalleClienteByIdDTO
                {
                    ClienteId = p.ClienteId,
                    Ruc = p.Ruc,
                    RazonSocial = p.RazonSocial,
                    Direccion = p.Direccion,
                }).FirstOrDefaultAsync(cancellationToken);

            if (cliente == null)
            {
                throw new Exception("Cliente no encontrado");
            }

            return cliente;
        }
    }
}
