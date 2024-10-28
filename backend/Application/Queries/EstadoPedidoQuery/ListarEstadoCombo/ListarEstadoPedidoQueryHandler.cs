using backend.Application.Queries.RolQuery.ListarRolesCombo;
using backend.Data;
using backend.Helper;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace backend.Application.Queries.EstadoPedidoQuery.ListarEstadoCombo
{
    public class ListarEstadoPedidoQueryHandler : IRequestHandler<ListarEstadoPedidoQuery, List<ComboBase>>
    {
        private readonly InventarioDbContext _context;
        public ListarEstadoPedidoQueryHandler(InventarioDbContext context)
        {
            _context = context;
        }
        public async Task<List<ComboBase>> Handle(ListarEstadoPedidoQuery request, CancellationToken cancellationToken)
        {
            var query = _context.EstadoPedidos
                .Where(p => p.DeletedAt == null)
                .AsQueryable();

            var data = await query
                .Select(p => new ComboBase
                {
                    Key = p.EstadoPedidoId,
                    Text = p.NombreEstadoPedido,
                })
                .ToListAsync(cancellationToken);

            return data;
        }
    }
}
