using MediatR;

namespace backend.Application.Queries.RolQuery.DetalleRol
{
    public class DetalleRolQuery: IRequest<DetalleRolDTO>
    {
        public Guid RolId { get; set; }
    }
}
