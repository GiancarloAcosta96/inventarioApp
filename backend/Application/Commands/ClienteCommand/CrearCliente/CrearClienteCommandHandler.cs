using backend.Data;
using backend.Helper;
using backend.Models.ClienteEntity;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace backend.Application.Commands.ClienteCommand.CrearCliente
{
    public class CrearClienteCommandHandler : IRequestHandler<CrearClienteCommand, Response>
    {
        private readonly InventarioDbContext _context;
        public CrearClienteCommandHandler(InventarioDbContext context) 
        {
            _context = context;
        }
        public async Task<Response> Handle(CrearClienteCommand request, CancellationToken cancellationToken)
        {
            try
            {
                TimeZoneInfo limaZone = TimeZoneInfo.FindSystemTimeZoneById("SA Pacific Standard Time");
                DateTime limaTime = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, limaZone);

                var cliente = await _context.Clientes
                    .AnyAsync(p => p.Ruc == request.Ruc);

                if (cliente)
                {
                    return new Response
                    {
                        Success = false,
                        Title = "Error al crear cliente",
                        Message = "El RUC ya existe."
                    };
                }

                var data = new Cliente
                {
                    Ruc = request.Ruc,
                    RazonSocial = request.RazonSocial,
                    Direccion = request.Direccion,
                    CreatedAt = limaTime
                };

                _context.Add(data);
                await _context.SaveChangesAsync();

                return new Response
                {
                    Success = true,
                    Title = "Cliente creado",
                    Message = "Se registró el cliente correctamente",
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
