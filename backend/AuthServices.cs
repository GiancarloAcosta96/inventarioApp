using backend.Models.UsuarioEntity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Mail;
using System.Net;
using System.Security.Claims;
using System.Text;

namespace backend
{
    public class AuthServices
    {
        private readonly IConfiguration _configuration;

        public AuthServices(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public string GenerateJwtToken(Usuario usuario)
        {
            var claims = new[]
            {
            new Claim(JwtRegisteredClaimNames.Sub, usuario.NombreUsuario),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(30),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public async Task SendPasswordResetEmail(string email, string resetUrl)
        {
            var mailMessage = new MailMessage
            {
                From = new MailAddress("sgii@noreply.com"),
                Subject = "Recuperación de contraseña",
                Body = $"Haga clic en el siguiente enlace para restablecer su contraseña: {resetUrl}",
                IsBodyHtml = true,
            };
            mailMessage.To.Add(email);

            using (var smtpClient = new SmtpClient("smtp.gmail.com"))
            {
                smtpClient.Port = 587;
                smtpClient.Credentials = new NetworkCredential("inventario271024@gmail.com", "271024@Citikold");
                smtpClient.EnableSsl = true;

                await smtpClient.SendMailAsync(mailMessage);
            }
        }
    }
}
