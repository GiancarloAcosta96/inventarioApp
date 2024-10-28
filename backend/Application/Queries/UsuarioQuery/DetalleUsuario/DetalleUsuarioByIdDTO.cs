namespace backend.Application.Queries.UsuarioQuery.DetalleUsuario
{
    public class DetalleUsuarioByIdDTO
    {
        public Guid UsuarioId { get; set; }
        public string Nombre { get; set; }
        public string Apellido { get; set; }
        public string NombreUsuario { get; set; }
        public string Email { get; set; }
        public string FechaRegistro { get; set; }
        public Guid RolId { get; set; }
        public string Rol {  get; set; }
    }
}
