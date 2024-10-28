export interface IClientes {
  clienteId: string;
  ruc: string;
  razonSocial: string;
  direccion: string;
}

export interface IAgregarCliente {
  ruc: string;
  razonSocial: string;
  direccion: string;
}

export interface IClientesCombo {
  key: string;
  text: string;
}

export interface IDetalleCliente {
  ruc: string;
  razonSocial: string;
  direccion: string;
}

export interface IEditarCliente {
  clienteId: string;
  ruc: string;
  razonSocial: string;
  direccion: string;
}

export interface IEstadoPedido {
  key: string;
  text: string;
}

export interface IEditarEstados {
  pedidos: IEstadosP[];
}

export interface IEstadosP {
  pedidoId: string;
  estadoPedidoId: string;
}
