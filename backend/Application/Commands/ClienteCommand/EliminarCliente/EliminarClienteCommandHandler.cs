using backend.Application.Commands.ProductoCommand.EliminarProducto;
using backend.Data;
using MediatR;

namespace backend.Application.Commands.ClienteCommand.EliminarCliente
{
    public class EliminarClienteCommandHandler : IRequestHandler<EliminarClienteCommand, Unit>
    {
        private readonly InventarioDbContext _context;
        public EliminarClienteCommandHandler(InventarioDbContext context)
        {
            _context = context;
        }
        public async Task<Unit> Handle(EliminarClienteCommand request, CancellationToken cancellationToken)
        {
            TimeZoneInfo limaZone = TimeZoneInfo.FindSystemTimeZoneById("SA Pacific Standard Time");
            DateTime limaTime = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, limaZone);

            var clienteId = await _context.Clientes.FindAsync(request.ClienteId);

            if (clienteId == null)
            {
                throw new Exception("No se encontró el cliente");
            }

            clienteId.ClienteId = request.ClienteId;
            clienteId.DeletedAt = limaTime;

            _context.Update(clienteId);
            await _context.SaveChangesAsync();

            return Unit.Value;
        }
    }
}
