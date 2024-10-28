using backend.Data;
using backend.Helper;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace backend.Application.Queries.RolQuery.ListarRolesCombo
{
    public class ListarRolesComboQueryHandler : IRequestHandler<ListarRolesComboQuery, List<ComboBase>>
    {
        private readonly InventarioDbContext _context;
        public ListarRolesComboQueryHandler(InventarioDbContext context) 
        {
            _context = context;
        }
        public async Task<List<ComboBase>> Handle(ListarRolesComboQuery request, CancellationToken cancellationToken)
        {
            var query = _context.Roles
                .Where(p => p.DeletedAt == null)
                .AsQueryable();

            var data = await query
                .Select(p => new ComboBase
                {
                    Key = p.RolId,
                    Text = p.NombreRol,
                })
                .ToListAsync(cancellationToken);

            return data;
        }
    }
}
