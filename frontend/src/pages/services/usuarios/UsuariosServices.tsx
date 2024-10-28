import { axiosUsuario } from "../http-common";

const obtenerUsuarios = (datos: string, pageNumber = 1, pageSize = 1) => {
  return axiosUsuario.get(`Usuario/ListarUsuarios?`, {
    params: {
      datos: datos || null,
      pageNumber: pageNumber,
      pageSize: pageSize,
    },
  });
};

const agregarUsuario = (data: {}) => {
  return axiosUsuario.post(`Usuario`, data);
};

const detalleUsuario = (usuarioId: string) => {
  return axiosUsuario.get(`Usuario/ObtenerUsuarioById?usuarioId=${usuarioId}`);
};

const editarUsuario = (data: {}) => {
  return axiosUsuario.put(`Usuario/EditarUsuario`, data);
};

const UsuariosServices = {
  obtenerUsuarios,
  agregarUsuario,
  detalleUsuario,
  editarUsuario,
};

export default UsuariosServices;
