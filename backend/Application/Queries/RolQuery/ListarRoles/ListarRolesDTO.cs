namespace backend.Application.Queries.RolQuery.ListarRoles
{
    public class ListarRolesDTO
    {
        public Guid RolId { get; set; }
        public string NombreRol { get; set; }
        public int AccesoTotal { get; set; }
    }
}
