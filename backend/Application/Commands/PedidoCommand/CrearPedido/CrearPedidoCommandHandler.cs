using backend.Data;
using backend.Helper;
using backend.Models;
using backend.Models.PedidoEntity;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Globalization;

namespace backend.Application.Commands.PedidoCommand.CrearPedido
{
    public class CrearPedidoCommandHandler : IRequestHandler<CrearPedidoCommand, Response>
    {
        private readonly InventarioDbContext _context;
        public CrearPedidoCommandHandler(InventarioDbContext context) 
        {
            _context = context;
        }
        public async Task<Response> Handle(CrearPedidoCommand request, CancellationToken cancellationToken)
        {
            try
            {
                TimeZoneInfo limaZone = TimeZoneInfo.FindSystemTimeZoneById("SA Pacific Standard Time");
                DateTime limaTime = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, limaZone);

                var usuario = await _context.Usuarios.FindAsync(request.UsuarioId);
                if (usuario == null)
                {
                    throw new Exception("El usuario no está creado");
                }
                var cliente = await _context.Clientes.FindAsync(request.ClienteId);
                if (cliente == null)
                {
                    throw new Exception("El cliente no existe");
                }

                if (!DateTime.TryParseExact(request.FechaPedido, "dd-MM-yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime fechaPedido))
                {
                    throw new Exception("El formato de la fecha es incorrecto. Debe ser dd-MM-yyyy.");
                }

                var estadoPendiente = await _context.EstadoPedidos
                    .Where(e => e.DeletedAt == null && e.NombreEstadoPedido == "Pendiente")
                    .FirstOrDefaultAsync();

                if (estadoPendiente == null) 
                {
                    throw new Exception("No se encontró estado");
                }

                var ultimaSeriePedido = await _context.Pedidos
                    .OrderByDescending(b => b.FechaPedido)
                    .FirstOrDefaultAsync(cancellationToken);

                int nuevoNumero = 1;
                if (ultimaSeriePedido != null && !string.IsNullOrEmpty(ultimaSeriePedido.SeriePedido))
                {
                    var ultimoNumeroStr = ultimaSeriePedido.SeriePedido.Substring(2);
                    if (int.TryParse(ultimoNumeroStr, out int ultimoNumero))
                    {
                        nuevoNumero = ultimoNumero + 1;
                    }
                }

                string nuevoNumeroPedido = $"F-{nuevoNumero.ToString("D10")}";

                var data = new Pedido
                {
                    UsuarioId = request.UsuarioId,
                    ClienteId = request.ClienteId,
                    EstadoPedidoId = estadoPendiente.EstadoPedidoId,
                    FechaPedido = fechaPedido,
                    SeriePedido = nuevoNumeroPedido,
                    CreatedAt = limaTime
                };
                _context.Add(data);
                double subtotalTotal = 0;

                foreach (var prods in request.Productos)
                {
                    var producto = _context.Productos.FirstOrDefault(p => p.ProductoId == prods.ProductoId);

                    if (producto != null)
                    {
                        var subtotal = prods.Cantidad * producto.Precio;
                        subtotalTotal += subtotal;

                        var productoPedido = new DetallePedido
                        {
                            ProductoId = prods.ProductoId,
                            PedidoId = data.PedidoId,
                            Cantidad = prods.Cantidad,
                            PrecioUnitario = producto.Precio,
                            Subtotal = subtotal,
                        };
                        _context.DetallePedidos.Add(productoPedido);
                    }
                    else
                    {
                        throw new Exception("Hubo un error, inténtalo nuevamente");
                    }
                }

                double iva = subtotalTotal * 0.15;
                double igv = subtotalTotal * 0.18;
                double total = subtotalTotal + igv;

                data.Iva = iva;
                data.Igv = igv;
                data.Total = total;


                await _context.SaveChangesAsync();

                return new Response
                {
                    Success = true,
                    Title = "Pedido creado",
                    Message = "Se registró el pedido correctamente",
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
