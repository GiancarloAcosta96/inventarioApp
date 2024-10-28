using backend.Application.Queries.RolQuery.ListarRoles;
using backend.Helper;
using MediatR;

namespace backend.Application.Queries.UsuarioQuery.ListarUsuarios
{
    public class ListarUsuarioQuery : IRequest<Paginacion<ListarUsuarioDTO>>
    {
        public string? Datos { get; set; }
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }
}
