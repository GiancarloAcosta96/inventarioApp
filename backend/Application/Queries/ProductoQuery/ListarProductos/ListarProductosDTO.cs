namespace backend.Application.Queries.ProductoQuery.ListarProductos
{
    public class ListarProductosDTO
    {
        public Guid ProductoId {  get; set; }
        public string NombreProducto { get; set; }
        public string Descripcion { get; set; }
        public double Precio { get; set; }
        public int CantidadStock {  get; set; }
    }
}
