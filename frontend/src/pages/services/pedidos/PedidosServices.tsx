import { axiosPedido } from "../http-common";

const obtenerPedidos = (
  estadoPedidoId: string,
  empresa: string,
  pageNumber = 1,
  pageSize = 1
) => {
  return axiosPedido.get(`Pedido/ListarPedidos?`, {
    params: {
      estadoPedidoId: estadoPedidoId || null,
      empresa: empresa || null,
      pageNumber: pageNumber,
      pageSize: pageSize,
    },
  });
};

const crearPedido = (data: {}) => {
  return axiosPedido.post(`Pedido/CrearPedido`, data);
};

const detallePedido = (pedidoId: string) => {
  return axiosPedido.get(`Pedido/ObtenerPedidoById?pedidoId=${pedidoId}`);
};

const obtenerEstadoPedido = () => {
  return axiosPedido.get(`EstadoPedido/ListarEstadoPedidoCombo`);
};

const editarEstadosPedidos = (data: {}) => {
  return axiosPedido.put(`Pedido/EditarEstadoPedido`, data);
};

const generarPedidoPdf = (pedidoId: string) => {
  return axiosPedido.get(`Pedido/GenerarPdfByPedidoId?pedidoId=${pedidoId}`);
};

const eliminarPedido = (data: {}) => {
  return axiosPedido.put(`Pedido/EliminarPedido`, data);
};

const PedidosServices = {
  obtenerPedidos,
  crearPedido,
  detallePedido,
  obtenerEstadoPedido,
  editarEstadosPedidos,
  generarPedidoPdf,
  eliminarPedido,
};

export default PedidosServices;
