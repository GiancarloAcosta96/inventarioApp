using Azure.Core;
using backend.Data;
using backend.Models.TokensAuthEntity;
using backend.Models.UsuarioEntity;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Mail;
using System.Net;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace backend.Controllers.Auth
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController: ControllerBase
    {
        private readonly AuthServices _authService;
        private readonly InventarioDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(InventarioDbContext context, IConfiguration configuration, AuthServices authService)
        {
            _context = context;
            _configuration = configuration;
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var usuario = await _context.Usuarios
                .Include(u => u.Rol)
                .SingleOrDefaultAsync(u => u.NombreUsuario == request.NombreUsuario);

            if (usuario == null || !VerifyPassword(request.Password, usuario.Password) || usuario.DeletedAt != null)
            {
                return Unauthorized(new { message = "Credenciales inválidas" });
            }

            var token = _authService.GenerateJwtToken(usuario);
            
            var tokenAuth = new TokensAuth
            {
                UsuarioId = usuario.UsuarioId,
                Token = token,
                FechaGeneracion = DateTime.UtcNow,
                FechaExpiracion = DateTime.UtcNow.AddHours(3),
                Usado = false
            };

            
            _context.TokensAuth.Add(tokenAuth);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                token,
                accesoTotal = usuario.Rol?.AccesoTotal ?? 0,
                nombre = usuario.Nombre + " " + usuario.Apellido,
                rol = usuario.Rol?.NombreRol ?? "",
                usuarioId = usuario.UsuarioId,
            });
        }

        private bool VerifyPassword(string password, string storedHash)
        {
            var hash = HashPassword(password);
            return hash == storedHash;
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

        private string GenerateJwtToken(Usuario user)
        {
            var claims = new[]
            {
            new Claim(JwtRegisteredClaimNames.Sub, user.UsuarioId.ToString()),
            new Claim(JwtRegisteredClaimNames.UniqueName, user.NombreUsuario),
            new Claim(ClaimTypes.Role, user.Rol?.NombreRol ?? "Rol")
        };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Issuer"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(3),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            var authHeader = HttpContext.Request.Headers["Authorization"].ToString();

            if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
            {
                return BadRequest(new { message = "Token no proporcionado" });
            }
            var token = authHeader.Substring("Bearer ".Length).Trim();

            var tokenAuth = await _context.TokensAuth
                .FirstOrDefaultAsync(t => t.Token == token && !t.Usado);

            if (tokenAuth == null)
            {
                return BadRequest(new { message = "Token no válido o ya usado" });
            }
            tokenAuth.Usado = true;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Sesión cerrada correctamente" });
        }

        //AQuí recupero  contraseña
        //Envío de enlace
        [HttpPost("request-password-reset")]
        public async Task<IActionResult> RequestPasswordReset([FromBody] PasswordResetRequest request)
        {
            var usuario = await _context.Usuarios.SingleOrDefaultAsync(u => u.Email == request.Email);
            if (usuario == null)
            {
                return NotFound(new { message = "Usuario no encontrado" });
            }

            // Generar token de recuperación
            var resetToken = Convert.ToBase64String(RandomNumberGenerator.GetBytes(32));
            var passwordResetToken = new TokensAuth
            {
                UsuarioId = usuario.UsuarioId,
                Token = resetToken,
                FechaGeneracion = DateTime.UtcNow,
                FechaExpiracion = DateTime.UtcNow.AddHours(1), // Expira en 1 hora
                Usado = false
            };

            _context.TokensAuth.Add(passwordResetToken);
            await _context.SaveChangesAsync();

            // Generar enlace de recuperación
            var resetUrl = $"http://192.168.18.64:5173/reset-password?token={resetToken}";

            // Enviar correo (aquí necesitas configurar tu servicio de correo)
            await _authService.SendPasswordResetEmail(request.Email, resetUrl);

            return Ok(new { message = "Se ha enviado un enlace de recuperación a su correo electrónico" });
        }

        public class PasswordResetRequest
        {
            public string Email { get; set; }
        }

        //Restablezco contraseña
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
        {
            var passwordResetToken = await _context.TokensAuth
                .FirstOrDefaultAsync(t => t.Token == request.Token && !t.Usado && t.FechaExpiracion > DateTime.UtcNow);

            if (passwordResetToken == null)
            {
                return BadRequest(new { message = "Token no válido o expirado" });
            }

            var usuario = await _context.Usuarios.FindAsync(passwordResetToken.UsuarioId);
            if (usuario == null)
            {
                return NotFound(new { message = "Usuario no encontrado" });
            }

            // Actualizar la contraseña y marcar el token como usado
            usuario.Password = HashPassword(request.NewPassword);
            passwordResetToken.Usado = true;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Contraseña restablecida correctamente" });
        }

        public class ResetPasswordRequest
        {
            public string Token { get; set; }
            public string NewPassword { get; set; }
        }

    }
    public class LoginRequest
    {
        public string NombreUsuario { get; set; }
        public string Password { get; set; }
    }
}
