export interface IAgregar {
  isOpen: boolean;
  isClose: () => void;
  reload: () => void;
}

export interface IEditar {
  isOpen: boolean;
  id: string;
  isClose: () => void;
  reload: () => void;
}

export interface IEliminar {
  isOpen: boolean;
  id: string;
  isClose: () => void;
  reload: () => void;
}
