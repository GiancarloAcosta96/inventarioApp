using backend.Data;
using MediatR;

namespace backend.Application.Commands.RolCommand.EliminarRol
{
    public class EliminarRolCommandHandler : IRequestHandler<EliminarRolCommand, Unit>
    {
        private readonly InventarioDbContext _context;
        public EliminarRolCommandHandler(InventarioDbContext context) 
        {
            _context = context;
        }
        public async Task<Unit> Handle(EliminarRolCommand request, CancellationToken cancellationToken)
        {
            TimeZoneInfo limaZone = TimeZoneInfo.FindSystemTimeZoneById("SA Pacific Standard Time");
            DateTime limaTime = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, limaZone);

            var rolId = await _context.Roles.FindAsync(request.RolId);

            if (rolId == null) 
            {
                throw new Exception("No se encontró el rol");
            }

            rolId.RolId = request.RolId;
            rolId.DeletedAt = limaTime;

            _context.Update(rolId);
            await _context.SaveChangesAsync();

            return Unit.Value;
        }
    }
}
