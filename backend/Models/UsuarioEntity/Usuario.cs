using backend.Models.RolEntity;

namespace backend.Models.UsuarioEntity
{
    public class Usuario: EntityBase
    {
        public Guid UsuarioId { get; set; }
        public string Nombre { get; set; }
        public string Apellido { get; set; }
        public string NombreUsuario { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public DateTime FechaRegistro { get; set; }
        public DateTime? UltimoAcceso { get; set; }
        public Rol Rol { get; set; }
        public Guid RolId { get; set; }
    }
}
