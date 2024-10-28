using MediatR;

namespace backend.Application.Commands.RolCommand.EliminarRol
{
    public class EliminarRolCommand: IRequest<Unit>
    {
        public Guid RolId { get; set; }
    }
}
