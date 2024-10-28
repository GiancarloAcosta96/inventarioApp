export interface IProductos {
  productoId: string;
  nombreProducto: string;
  descripcion: string;
  precio: number;
  cantidadStock: number;
}

export interface IAgregarProducto {
  nombreProducto: string;
  descripcion: string;
  precio: number;
  cantidadStock: number;
}

export interface IEditarProducto {
  productoId: string;
  nombreProducto: string;
  descripcion: string;
  precio: number;
  cantidadStock: number;
}

export interface IEliminarProducto {
  productoId: string;
}

export interface IDataInventario {
  totalProducto: number;
  totalInventario: number;
  promedioInventario: number;
  cantidadPedidosPendientes: number;
  cantidadPedidosAprobados: number;
}
