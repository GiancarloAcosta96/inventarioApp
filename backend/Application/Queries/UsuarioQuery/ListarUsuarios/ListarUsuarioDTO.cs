namespace backend.Application.Queries.UsuarioQuery.ListarUsuarios
{
    public class ListarUsuarioDTO
    {
        public Guid UsuarioId {  get; set; }
        public string Nombre {  get; set; }
        public string NombreUsuario { get; set; }
        public string Email { get; set; }
        public string FechaRegistro {  get; set; }
        public DateTime? UltimoAcceso { get; set; }
        public string Rol {  get; set; }
    }
}
