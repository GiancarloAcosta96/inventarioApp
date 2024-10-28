namespace backend.Application.Queries.ProductoQuery.InventarioQuery
{
    public class ListarInventarioDTO
    {
        public int TotalProducto {  get; set; }
        public double TotalInventario { get; set; }
        public double PromedioInventario { get; set; }
        public int CantidadPedidosPendientes {  get; set; }
        public int CantidadPedidosAprobados { get; set; }
    }
}
