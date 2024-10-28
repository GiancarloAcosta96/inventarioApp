using backend.Models.PedidoEntity;
using backend.Models.ProductoEntity;

namespace backend.Models
{
    public class DetallePedido: EntityBase
    {
        public Guid DetallePedidoId { get; set; }
        public Producto Producto { get; set; }
        public Guid ProductoId { get; set; }
        public Pedido Pedido { get; set; }
        public Guid PedidoId { get; set; }
        public int Cantidad { get; set; }
        public double PrecioUnitario { get; set; }
        public double Subtotal { get; set; }
    }
}
