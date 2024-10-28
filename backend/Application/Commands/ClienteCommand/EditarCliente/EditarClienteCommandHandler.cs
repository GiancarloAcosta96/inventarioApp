using backend.Application.Commands.ProductoCommand.EditarProducto;
using backend.Data;
using backend.Helper;
using MediatR;

namespace backend.Application.Commands.ClienteCommand.EditarCliente
{
    public class EditarClienteCommandHandler : IRequestHandler<EditarClienteCommand, Response>
    {
        private readonly InventarioDbContext _context;
        public EditarClienteCommandHandler(InventarioDbContext context)
        {
            _context = context;
        }
        public async Task<Response> Handle(EditarClienteCommand request, CancellationToken cancellationToken)
        {
            try
            {
                TimeZoneInfo limaZone = TimeZoneInfo.FindSystemTimeZoneById("SA Pacific Standard Time");
                DateTime limaTime = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, limaZone);

                var clienteId = await _context.Clientes.FindAsync(request.ClienteId);

                if (clienteId == null)
                {
                    throw new Exception("Cliente no encontrado");
                }

                clienteId.ClienteId = request.ClienteId;
                clienteId.Ruc = request.Ruc;
                clienteId.RazonSocial = request.RazonSocial;
                clienteId.Direccion = request.Direccion;
                clienteId.UpdatedAt = limaTime;

                _context.Update(clienteId);
                await _context.SaveChangesAsync();

                return new Response
                {
                    Success = true,
                    Title = "Cliente editado",
                    Message = "Se editó el cliente correctamente",
                };
            }
            catch (Exception ex) 
            {
                return new Response
                {
                    Success = false,
                    Title = "Error inesperado",
                    Message = $"Ocurrió un error inesperado: {ex.Message}"
                };
            }
        }
    }
}
