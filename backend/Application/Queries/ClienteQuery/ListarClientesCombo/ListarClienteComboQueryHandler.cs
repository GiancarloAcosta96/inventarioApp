using backend.Data;
using backend.Helper;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace backend.Application.Queries.ClienteQuery.ListarClientesCombo
{
    public class ListarClienteComboQueryHandler : IRequestHandler<ListarClienteComboQuery, List<ComboBase>>
    {
        private readonly InventarioDbContext _context;
        public ListarClienteComboQueryHandler(InventarioDbContext context) 
        {
            _context = context;
        }
        public async Task<List<ComboBase>> Handle(ListarClienteComboQuery request, CancellationToken cancellationToken)
        {
            var query = _context.Clientes
                .Where(p => p.DeletedAt == null)
                .AsQueryable();

            if (!string.IsNullOrEmpty(request.Empresa))
            {
                query = query.Where(
                    p => (string.IsNullOrEmpty(request.Empresa) || p.RazonSocial.Contains(request.Empresa))
                    ||
                    (string.IsNullOrEmpty(request.Empresa) || p.Ruc.Contains(request.Empresa))
                    );
            }

            var data = await query
                .Select(p => new ComboBase
                {
                    Key = p.ClienteId,
                    Text = p.RazonSocial,
                })
                .ToListAsync(cancellationToken);

            return data;
        }
    }
}
