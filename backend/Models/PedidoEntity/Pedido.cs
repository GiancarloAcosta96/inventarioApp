using backend.Models.ClienteEntity;
using backend.Models.UsuarioEntity;

namespace backend.Models.PedidoEntity
{
    public class Pedido: EntityBase
    {
        public Guid PedidoId { get; set; }
        public Guid UsuarioId {  get; set; }
        public string SeriePedido {  get; set; }
        public Usuario Usuario { get; set; }
        public Cliente Cliente { get; set; }
        public Guid ClienteId { get; set; }
        public DateTime FechaPedido { get; set; }
        public EstadoPedido EstadoPedido { get; set; }
        public Guid EstadoPedidoId { get; set; }
        public double Igv {  get; set; }
        public double Iva { get; set; }
        public double Total { get; set; }
        public ICollection<DetallePedido> DetallePedidos { get; set; }
    }
}
