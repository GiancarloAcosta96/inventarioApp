using MediatR;

namespace backend.Application.Queries.UsuarioQuery.DetalleUsuario
{
    public class DetalleUsuarioByIdQuery: IRequest<DetalleUsuarioByIdDTO>
    {
        public Guid UsuarioId { get; set; }
    }
}
