namespace backend.Application.Queries.PedidoQuery.ListarPedidos
{
    public class ListarPedidosDTO
    {
        public Guid PedidoId { get; set; }
        public Guid UsuarioId { get; set; }
        public Guid ClienteId { get; set; }
        public string CreadoPor {  get; set; }
        public string EstadoPedido { get; set; }
        public string SeriePedido { get; set; }
        public string Ruc { get; set; }
        public string RazonSocial {  get; set; }
        public string FechaPedido {  get; set; }
        public string HoraPedido { get; set; }
        public double Igv {  get; set; }
        public double Iva {  get; set; }
        public double Total { get; set; }
    }
}
