namespace backend.Models.RolEntity
{
    public class Rol: EntityBase
    {
        public Guid RolId { get; set; }
        public string NombreRol { get; set; }
        public int AccesoTotal {  get; set; }
    }
}
