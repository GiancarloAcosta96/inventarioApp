import { axiosRol } from "../http-common";

const obtenerRoles = (nombreRol: string, pageNumber = 1, pageSize = 1) => {
  return axiosRol.get(`Rol/ListarRoles?`, {
    params: {
      nombreRol: nombreRol || null,
      pageNumber: pageNumber,
      pageSize: pageSize,
    },
  });
};

const obtenerRolesCombo = (nombreRol: string) => {
  return axiosRol.get(`Rol/ListarRolesCombo?`, {
    params: {
      nombreRol: nombreRol || null,
    },
  });
};

const agregarRol = (data: {}) => {
  return axiosRol.post(`Rol/CrearRol`, data);
};

const detalleRol = (productoId: string) => {
  return axiosRol.get(`Rol/ObtenerRolById?rolId=${productoId}`);
};

const editarRol = (data: {}) => {
  return axiosRol.put(`Rol/EditarRol`, data);
};

const RolesServices = {
  obtenerRoles,
  obtenerRolesCombo,
  agregarRol,
  detalleRol,
  editarRol,
};

export default RolesServices;
