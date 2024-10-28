namespace backend.Application.Queries.ClienteQuery.DetalleCliente
{
    public class DetalleClienteByIdDTO
    {
        public Guid ClienteId { get; set; }
        public string Ruc {  get; set; }
        public string RazonSocial { get; set; }
        public string Direccion {  get; set; }
    }
}
