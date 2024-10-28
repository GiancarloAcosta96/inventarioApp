export interface IUsuarios {
  usuarioId: string;
  nombre: string;
  nombreUsuario: string;
  email: string;
  fechaRegistro: string;
  rol: string;
}

export interface IAgregarUsuario {
  nombreUsuario: string;
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  rolId: string;
}

export interface IRolCombo {
  key: string;
  text: string;
}

export interface IEditarUsuario {
  usuarioId: string;
  nombre: string;
  apellido: string;
  nombreUsuario: string;
  rolId: string;
  rol: string;
}
