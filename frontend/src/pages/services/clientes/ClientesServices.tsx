import { axiosCliente } from "../http-common";

const obtenerClientes = (empresa: string, pageNumber = 1, pageSize = 1) => {
  return axiosCliente.get(`Clientes/ListarClientes?`, {
    params: {
      empresa: empresa || null,
      pageNumber: pageNumber,
      pageSize: pageSize,
    },
  });
};

const agregarCliente = (data: {}) => {
  return axiosCliente.post(`Clientes/CrearCliente`, data);
};

const obtenerClienteCombo = (empresa: string) => {
  return axiosCliente.get(`Clientes/ListarClientesCombo?`, {
    params: {
      empresa: empresa,
    },
  });
};

const obtenerClienteById = (clienteId: string) => {
  return axiosCliente.get(`Clientes/ObtenerClienteById?`, {
    params: {
      clienteId: clienteId,
    },
  });
};

const editarCliente = (data: {}) => {
  return axiosCliente.put(`Clientes/EditarCliente`, data);
};

const ClientesServices = {
  obtenerClientes,
  agregarCliente,
  obtenerClienteCombo,
  obtenerClienteById,
  editarCliente,
};

export default ClientesServices;
