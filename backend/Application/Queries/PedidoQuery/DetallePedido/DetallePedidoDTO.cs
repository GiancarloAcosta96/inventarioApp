namespace backend.Application.Queries.PedidoQuery.DetallePedido
{
    public class DetallePedidoDTO
    {
        public Guid PedidoId { get; set; }
        public string RegistradoPor {  get; set; }
        public string Estado {  get; set; }
        public string FechaPedido { get; set; }
        public string SeriePedido { get; set; }
        public string Ruc {  get; set; }
        public string RazonSocial { get; set; }
        public string Direccion {  get; set; }
        public double SubTotal { get; set; }
        public double Igv {  get; set; }
        public double Iva {  get; set; }
        public double Total {  get; set; }
        public List<ProductoPedidoDTO> Productos { get; set; }
    }

    public class ProductoPedidoDTO
    {
        public string NombreProducto { get; set; }
        public int Cantidad { get; set; }
        public double Precio { get; set; }
    }
}
