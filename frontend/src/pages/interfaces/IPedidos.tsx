export interface IPedidos {
  pedidoId: string;
  usuarioId: string;
  clienteId: string;
  razonSocial: string;
  fechaPedido: string;
  horaPedido: string;
  estadoPedido: string;
  creadoPor: string;
  igv: number;
  iva: number;
  total: number;
}

export interface IAgregarPedido {
  usuarioId: string | null;
  clienteId: string;
  fechaPedido: string;
  productos: IPedidoProductos[];
}

export interface IPedidoProductos {
  productoId: string;
  cantidad: number;
}

export interface IDetallePedido {
  fechaPedido: string;
  horaPedido: string;
  registradoPor: string;
  estado: string;
  seriePedido: string;
  ruc: string;
  razonSocial: string;
  direccion: string;
  subTotal: string;
  igv: string;
  iva: string;
  total: string;
  productos: IProductos[];
}

export interface IProductos {
  nombreProducto: string;
  cantidad: number;
  precio: number;
}

export interface IEliminarPedido {
  pedidoId: string;
}
