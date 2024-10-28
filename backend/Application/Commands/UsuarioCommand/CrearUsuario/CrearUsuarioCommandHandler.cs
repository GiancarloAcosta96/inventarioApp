using backend.Data;
using backend.Helper;
using backend.Models.UsuarioEntity;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;

namespace backend.Application.Commands.UsuarioCommand.CrearUsuario
{
    public class CrearUsuarioCommandHandler : IRequestHandler<CrearUsuarioCommand, Response>
    {
        private readonly InventarioDbContext _context;
        public CrearUsuarioCommandHandler(InventarioDbContext context) 
        {
            _context = context;
        }
        public async Task<Response> Handle(CrearUsuarioCommand request, CancellationToken cancellationToken)
        {
            try
            {
                TimeZoneInfo limaZone = TimeZoneInfo.FindSystemTimeZoneById("SA Pacific Standard Time");
                DateTime limaTime = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, limaZone);

                var usuarioExiste = await _context.Usuarios
                    .AnyAsync(u => u.NombreUsuario == request.NombreUsuario || u.Email == request.Email && u.DeletedAt == null, cancellationToken);

                if (usuarioExiste)
                {
                    throw new Exception("El usuario ya está creado");
                }

                if (!IsValidPassword(request.Password))
                {
                    return new Response
                    {
                        Success = false,
                        Title = "Error de validación",
                        Message = "La contraseña debe tener al menos 8 caracteres, incluyendo una letra mayúscula, una letra minúscula, un número y un carácter especial."
                    };
                }

                var passwordHash = HashPassword(request.Password);

                var usuario = new Usuario
                {
                    NombreUsuario = request.NombreUsuario,
                    Nombre = request.Nombre,
                    Apellido = request.Apellido,
                    Email = request.Email,
                    Password = passwordHash,
                    RolId = request.RolId,
                    FechaRegistro = limaTime,
                    CreatedAt = limaTime,
                };

                _context.Add(usuario);
                await _context.SaveChangesAsync(cancellationToken);

                return new Response
                {
                    Success = true,
                    Title = "Usuario creado",
                    Message = "Se creó el usuario correctamente",
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

        private string HashPassword(string password)
        {
            using (var sha256 = SHA256.Create())
            {
                var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                var builder = new StringBuilder();
                foreach (var c in bytes)
                {
                    builder.Append(c.ToString("x2"));
                }

                return builder.ToString();
            }
        }

        private bool IsValidPassword(string password)
        {
            var regex = new Regex(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$");
            return regex.IsMatch(password);
        }
    }
}
