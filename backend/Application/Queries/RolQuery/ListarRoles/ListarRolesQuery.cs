using backend.Helper;
using MediatR;

namespace backend.Application.Queries.RolQuery.ListarRoles
{
    public class ListarRolesQuery: IRequest<Paginacion<ListarRolesDTO>>
    {
        public string? NombreRol { get; set; }
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }
}
