using backend.Application.Queries.PedidoQuery.DetallePedido;

namespace backend.Application.Queries.PedidoQuery.GenerarPedidoPdf
{
    public interface IPdfGenerador
    {
        Task<string> GeneratePdf(DetallePedidoDTO detallePedido);
    }
}
