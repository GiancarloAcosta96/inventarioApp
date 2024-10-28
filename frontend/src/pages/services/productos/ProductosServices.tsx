import { axiosProducto } from "../http-common";

const obtenerProductos = (
  nombreProducto: string,
  pageNumber = 1,
  pageSize = 1
) => {
  return axiosProducto.get(`Producto/ListarProductos?`, {
    params: {
      nombreProducto: nombreProducto || null,
      pageNumber: pageNumber,
      pageSize: pageSize,
    },
  });
};

const agregarProducto = (data: {}) => {
  return axiosProducto.post(`Producto/CrearProducto`, data);
};

const detalleProducto = (productoId: string) => {
  return axiosProducto.get(
    `Producto/ObtenerProductoById?productoId=${productoId}`
  );
};

const editarProducto = (data: {}) => {
  return axiosProducto.put(`Producto/EditarProducto`, data);
};

const eliminarProducto = (data: {}) => {
  return axiosProducto.put(`Producto/EliminarProducto`, data);
};

const obtenerInventario = () => {
  return axiosProducto.get(`Producto/Inventario`);
};

const ProductosServices = {
  obtenerProductos,
  agregarProducto,
  detalleProducto,
  editarProducto,
  eliminarProducto,
  obtenerInventario,
};

export default ProductosServices;
