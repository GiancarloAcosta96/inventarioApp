﻿using Azure.Core;
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
using backend.Helper;

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
                .SingleOrDefaultAsync(u => u.NombreUsuario == request.NombreUsuario && u.DeletedAt == null);

            if (usuario == null)
            {
                return Unauthorized(new { message = "Credenciales inválidas" });
            }

            if (usuario.DeletedAt != null)
            {
                return Unauthorized(new { message = "Cuenta bloqueada por múltiples intentos fallidos. Contacte al administrador." });
            }

            if (!VerifyPassword(request.Password, usuario.Password))
            {
                usuario.IntentosFailidos = (usuario.IntentosFailidos ?? 0) + 1;

                if (usuario.IntentosFailidos >= 5)
                {
                    usuario.DeletedAt = DateTime.UtcNow;
                    await _context.SaveChangesAsync();
                    return Unauthorized(new { message = "Cuenta bloqueada por múltiples intentos fallidos. Contacte al administrador." });
                }

                await _context.SaveChangesAsync();
                return Unauthorized(new
                {
                    message = "Credenciales inválidas",
                    intentosRestantes = 5 - usuario.IntentosFailidos
                });
            }

            // Si la contraseña es correcta, reiniciar el contador de intentos
            usuario.IntentosFailidos = 0;

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
        [HttpPost("request-password-reset")]
        public async Task<Response> RequestPasswordReset([FromBody] PasswordResetRequest request)
        {
            try
            {
                var usuario = await _context.Usuarios.SingleOrDefaultAsync(u => u.Email == request.Email);
                if (usuario == null)
                {
                    return new Response
                    {
                        Success = false,
                        Title = "Error",
                        Message = "Usuario no encontrado."
                    };
                }

                // Generar token de recuperación
                var resetToken = Convert.ToBase64String(RandomNumberGenerator.GetBytes(32));
                var passwordResetToken = new TokensAuth
                {
                    UsuarioId = usuario.UsuarioId,
                    Token = resetToken,
                    FechaGeneracion = DateTime.UtcNow,
                    FechaExpiracion = DateTime.UtcNow.AddHours(1),
                    Usado = false
                };

                _context.TokensAuth.Add(passwordResetToken);
                await _context.SaveChangesAsync();

                // Generar enlace de recuperación
                var resetUrl = $"https://inventarioapp-backend-hzahh2g8axd5c9b0.canadacentral-01.azurewebsites.net/reset-password?token={resetToken}";

                // Enviar correo
                await _authService.SendPasswordResetEmail(request.Email, resetUrl);

                return new Response
                {
                    Success = true,
                    Title = "Correo enviado",
                    Message = "Se envíó el correo",
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
