namespace backend.Application.Queries.ClienteQuery.ListarClientes
{
    public class ListarClientesDTO
    {
        public Guid ClienteId { get; set; }
        public string Ruc {  get; set; }
        public string RazonSocial { get; set; }
        public string Direccion {  get; set; }
    }
}
