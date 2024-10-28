using backend.Data;
using Microsoft.EntityFrameworkCore;

public class TokenValidationMiddleware
{
    private readonly RequestDelegate _next;
    private readonly IServiceProvider _serviceProvider;

    public TokenValidationMiddleware(RequestDelegate next, IServiceProvider serviceProvider)
    {
        _next = next;
        _serviceProvider = serviceProvider;
    }

    public async Task Invoke(HttpContext context)
    {
        var authHeader = context.Request.Headers["Authorization"].ToString();

        if (!string.IsNullOrEmpty(authHeader) && authHeader.StartsWith("Bearer "))
        {
            var token = authHeader.Substring("Bearer ".Length).Trim();

            using (var scope = _serviceProvider.CreateScope())
            {
                var dbContext = scope.ServiceProvider.GetRequiredService<InventarioDbContext>();

                var tokenAuth = await dbContext.TokensAuth.FirstOrDefaultAsync(t => t.Token == token);

                if (tokenAuth != null)
                {
                    if (DateTime.UtcNow > tokenAuth.FechaExpiracion)
                    {
                        tokenAuth.Usado = true;
                        await dbContext.SaveChangesAsync();

                        context.Response.StatusCode = 401;
                        await context.Response.WriteAsync("Token expirado. Inicia sesión nuevamente.");
                        return;
                    }

                    if (tokenAuth.Usado)
                    {
                        context.Response.StatusCode = 401;
                        await context.Response.WriteAsync("Token ya ha sido usado. Inicia sesión nuevamente.");
                        return;
                    }
                }
                else
                {
                    context.Response.StatusCode = 401;
                    await context.Response.WriteAsync("Token no encontrado. Inicia sesión nuevamente.");
                    return;
                }
            }
        }
        await _next(context);
    }
}
