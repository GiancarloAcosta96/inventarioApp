namespace backend.Models.ClienteEntity
{
    public class Cliente: EntityBase
    {
        public Guid ClienteId { get; set; }
        public string Ruc {  get; set; }
        public string RazonSocial { get; set; }
        public string Direccion { get; set; }
    }
}
