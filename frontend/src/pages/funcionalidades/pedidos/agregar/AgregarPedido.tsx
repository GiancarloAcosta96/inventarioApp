import {
  Button,
  SearchBoxChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableCellLayout,
  TableHeader,
  TableHeaderCell,
  TableRow,
  DrawerBody,
  DrawerHeader,
  DrawerHeaderTitle,
  Input,
  OverlayDrawer,
  Option,
  Combobox,
  Label,
  Divider,
  Field,
} from "@fluentui/react-components";
import React, { useEffect, useState } from "react";
import ProductosServices from "../../../services/productos/ProductosServices";
import { IProductos } from "../../../interfaces/IProductos";
import TableSkeleton from "../../../../components/TablaCarga";
import {
  AddRegular,
  DeleteRegular,
  Dismiss24Regular,
  SubtractRegular,
} from "@fluentui/react-icons";
import { IClientesCombo, IDetalleCliente } from "../../../interfaces/IClientes";
import ClientesServices from "../../../services/clientes/ClientesServices";
import { IAgregarPedido } from "../../../interfaces/IPedidos";
import Paginacion from "../../../../components/Paginacion";
import { DatePicker } from "@fluentui/react-datepicker-compat";
import { onFormatDate } from "../../../../hooks/useFormatDate";
import PedidosServices from "../../../services/pedidos/PedidosServices";
import { IAgregar } from "../../../../components/InterfaceProps";

export interface ProductoSeleccionado {
  productoId: string;
  precio: number;
  cantidad: number;
  precioTotal: number;
  nombreProducto: string;
}

const AgregarPedido: React.FC<IAgregar> = ({ isOpen, isClose, reload }) => {
  const [productosSeleccionados, setProductosSeleccionados] = useState<
    ProductoSeleccionado[]
  >([]);
  const [dataClientes, setDataClientes] = useState<IClientesCombo[]>(null!);
  const [dataAgregarPedido, setDataAgregarPedido] = useState<IAgregarPedido>({
    usuarioId: "",
    clienteId: "",
    fechaPedido: "",
    productos: [],
  });
  const today = new Date();
  const usuarioId = localStorage.getItem("usuarioId");
  const [dataProductos, setDataProductos] = useState<IProductos[]>([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [nombre, setNombre] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [detalleEmpresa, setDetalleEmpresa] = useState<IDetalleCliente>(null!);
  const [isLoading, setIsLoading] = useState(true);
  const [value, setValue] = useState<Date | undefined>(null!);
  const pageSize = 11;

  const totalProductos = productosSeleccionados.reduce(
    (acc, p) => acc + p.precioTotal,
    0
  );
  const igv = totalProductos * 0.18;
  const iva = totalProductos * 0.15;
  const total = totalProductos + igv;

  const onParseDateFromString = React.useCallback(
    (newValue: string): Date => {
      const previousValue = value || new Date();
      const newValueParts = (newValue || "").trim().split("/");
      const day =
        newValueParts.length > 0
          ? Math.max(1, Math.min(31, parseInt(newValueParts[0], 10)))
          : previousValue.getDate();
      const month =
        newValueParts.length > 1
          ? Math.max(1, Math.min(12, parseInt(newValueParts[1], 10))) - 1
          : previousValue.getMonth();
      let year =
        newValueParts.length > 2
          ? parseInt(newValueParts[2], 10)
          : previousValue.getFullYear();
      if (year < 100) {
        year +=
          previousValue.getFullYear() - (previousValue.getFullYear() % 100);
      }
      return new Date(year, month, day);
    },
    [value]
  );

  function registrarPedido() {
    PedidosServices.crearPedido(dataAgregarPedido).then((res) => {
      if (res.status == 200) {
        alert("se registró el pedido");
      }
    });
  }

  function obtenerProductos(pageNumber = 1) {
    ProductosServices.obtenerProductos(nombre, pageNumber, pageSize).then(
      (res) => {
        if (res.status == 200) {
          setIsLoading(false);
          setDataProductos(res.data.items);
          setTotalPages(res.data.totalPages);
        }
      }
    );
  }

  function obtenerClientes() {
    ClientesServices.obtenerClienteCombo(empresa).then((res) => {
      if (res.status === 200) {
        const dataCat = res.data.map((x: IClientesCombo) => ({
          key: x.key,
          text: x.text,
        }));
        setDataClientes(dataCat);
      }
    });
  }

  function obtenerDetalleCliente() {
    ClientesServices.obtenerClienteById(dataAgregarPedido?.clienteId).then(
      (res) => {
        if (res.status == 200) {
          setDetalleEmpresa(res.data);
        }
      }
    );
  }

  const agregarProducto = (producto: IProductos) => {
    setProductosSeleccionados((prev: any) => {
      const productoExistente = prev.find(
        (p: any) => p.productoId === producto.productoId
      );
      if (productoExistente) {
        return prev.map((p: any) =>
          p.productoId === producto.productoId
            ? {
                ...p,
                cantidad: p.cantidad + 1,
                precioTotal: (p.cantidad + 1) * p.precio,
              }
            : p
        );
      } else {
        return [
          ...prev,
          {
            productoId: producto.productoId,
            nombreProducto: producto.nombreProducto,
            precio: producto.precio,
            cantidad: 1,
            precioTotal: producto.precio,
          },
        ];
      }
    });
  };

  const capturarNombre = (event: SearchBoxChangeEvent) => {
    const target = event.target as HTMLInputElement;
    setEmpresa(target.value);
  };

  const limpiarInputs = () => {
    setDataAgregarPedido({
      usuarioId: "",
      clienteId: "",
      fechaPedido: "",
      productos: [],
    });
    setValue(null!);
    setDetalleEmpresa({
      ruc: "",
      razonSocial: "",
      direccion: "",
    });
    setProductosSeleccionados([]);
  };

  const handleClienteChange = (event: any, option: any) => {
    setDataAgregarPedido((prevState) => ({
      ...prevState,
      clienteId: option.optionValue,
      usuarioId: usuarioId,
    }));
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const eliminarProducto = (productoId: string) => {
    const productosFiltrados = productosSeleccionados.filter(
      (producto) => producto.productoId !== productoId
    );
    setProductosSeleccionados(productosFiltrados);
  };

  const incrementarCantidad = (productoId: string) => {
    setProductosSeleccionados((prev) =>
      prev.map((p) =>
        p.productoId === productoId
          ? {
              ...p,
              cantidad: p.cantidad + 1,
              precioTotal: (p.cantidad + 1) * p.precio,
            }
          : p
      )
    );
  };

  const decrementarCantidad = (productoId: string) => {
    setProductosSeleccionados((prev) =>
      prev.map((p) =>
        p.productoId === productoId && p.cantidad > 1
          ? {
              ...p,
              cantidad: p.cantidad - 1,
              precioTotal: (p.cantidad - 1) * p.precio,
            }
          : p
      )
    );
  };

  const handleClose = () => {
    limpiarInputs();
    isClose();
  };

  const columns = [
    { columnKey: "nombreProducto", label: "Producto" },
    { columnKey: "precio", label: "Precio" },
    { columnKey: "cantidadStock", label: "Cantidad en Stock" },
    { columnKey: "opciones", label: "Opciones" },
  ];

  useEffect(() => {
    setDataAgregarPedido((prevState) => ({
      ...prevState,
      productos: productosSeleccionados.map((producto) => ({
        productoId: producto.productoId,
        cantidad: producto.cantidad,
      })),
    }));
  }, [productosSeleccionados]);

  useEffect(() => {
    if (dataAgregarPedido.clienteId) {
      obtenerDetalleCliente();
    }
  }, [dataAgregarPedido.clienteId]);

  useEffect(() => {
    obtenerClientes();
  }, [empresa]);

  useEffect(() => {
    obtenerProductos(currentPage);
  }, [currentPage]);

  useEffect(() => {
    if (
      productosSeleccionados.length > 0 &&
      dataAgregarPedido?.clienteId != "" &&
      dataAgregarPedido?.fechaPedido != ""
    ) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [
    productosSeleccionados,
    dataAgregarPedido?.fechaPedido,
    dataAgregarPedido?.clienteId,
  ]);

  return (
    <>
      <OverlayDrawer
        position="end"
        style={{ width: `80%` }}
        as="aside"
        open={isOpen}
      >
        <DrawerHeader style={{ marginBottom: "2%" }}>
          <DrawerHeaderTitle
            action={
              <Button
                appearance="subtle"
                aria-label="Close"
                icon={<Dismiss24Regular />}
                onClick={handleClose}
              />
            }
          >
            Registrar Pedido
          </DrawerHeaderTitle>
        </DrawerHeader>

        <DrawerBody>
          <div
            style={{
              height: "100%",
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div style={{ width: "49%", height: "100%" }} id="izquierda">
              <div>
                <Label>Cliente</Label>
                <Combobox
                  style={{ width: "100%" }}
                  placeholder="Selecciona el cliente"
                  onChange={capturarNombre}
                  onOptionSelect={handleClienteChange}
                >
                  {dataClientes?.map((option) => (
                    <Option
                      key={option.key}
                      text={option.text}
                      value={option.key}
                    >
                      {option?.text}
                    </Option>
                  ))}
                </Combobox>
                <br />
                <br />
                <div
                  style={{
                    display: "flex",
                    marginBottom: "10px",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ width: "49%" }}>
                    <Label>Ruc</Label>
                    <Input
                      name="ruc"
                      readOnly
                      style={{ display: "flex", flexDirection: "column" }}
                      value={detalleEmpresa?.ruc ?? ""}
                    />
                  </div>
                  <div style={{ width: "49%" }}>
                    <Label>Razón Social</Label>
                    <Input
                      name="razonSocial"
                      style={{ display: "flex", flexDirection: "column" }}
                      value={detalleEmpresa?.razonSocial ?? ""}
                    />
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    marginBottom: "10px",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ width: "49%" }}>
                    <Label>Dirección</Label>
                    <Input
                      name="direccion"
                      style={{ display: "flex", flexDirection: "column" }}
                      value={detalleEmpresa?.direccion ?? ""}
                    />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      width: "49%",
                    }}
                  >
                    <Label>Fecha de pedido</Label>
                    <DatePicker
                      allowTextInput
                      value={value}
                      onSelectDate={(date?: Date | null) => {
                        if (date != null) {
                          const day = date
                            .getDate()
                            .toString()
                            .padStart(2, "0");
                          const month = (date.getMonth() + 1)
                            .toString()
                            .padStart(2, "0");
                          const year = date.getFullYear();
                          const formattedDate = `${day}-${month}-${year}`;
                          setValue(date);
                          setDataAgregarPedido({
                            ...dataAgregarPedido,
                            fechaPedido: formattedDate,
                          });
                        }
                      }}
                      formatDate={onFormatDate}
                      parseDateFromString={onParseDateFromString}
                      placeholder="Selecciona una fecha"
                      maxDate={today}
                    />
                  </div>
                </div>
              </div>
              <br />

              <div
                style={{
                  display: "flex",
                  height: "62%",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                {/* Tabla de productos disponibles */}
                <div
                  style={{
                    flex: "1",
                    marginRight: "10px",
                    height: "100%",
                  }}
                >
                  <Divider style={{ marginBottom: "20px" }}></Divider>
                  {/* <pre>{JSON.stringify(dataAgregarPedido, null, 2)}</pre> */}
                  {/* <pre>{JSON.stringify(productosSeleccionados, null, 2)}</pre> */}
                  <h3 style={{ marginBottom: "10px" }}>
                    Productos Disponibles
                  </h3>
                  <div
                    style={{
                      marginTop: "10vh",
                      width: "100%",
                      margin: "auto",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <div style={{ flex: "1 1 auto", overflowY: "auto" }}>
                      <Table
                        role="grid"
                        aria-label="Table with grid keyboard navigation"
                      >
                        <TableHeader>
                          <TableRow>
                            {columns.map((column) => (
                              <TableHeaderCell key={column.columnKey}>
                                {column.label}
                              </TableHeaderCell>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {!isLoading ? (
                            dataProductos.map((item) => (
                              <TableRow key={item.productoId}>
                                <TableCell tabIndex={0} role="gridcell">
                                  <TableCellLayout>
                                    {item.nombreProducto}
                                  </TableCellLayout>
                                </TableCell>
                                <TableCell tabIndex={0} role="gridcell">
                                  <TableCellLayout>
                                    S/ {item.precio}
                                  </TableCellLayout>
                                </TableCell>
                                <TableCell tabIndex={0} role="gridcell">
                                  <TableCellLayout>
                                    {item.cantidadStock}
                                  </TableCellLayout>
                                </TableCell>
                                <TableCell tabIndex={0} role="gridcell">
                                  <Button
                                    onClick={() => agregarProducto(item)}
                                    style={{
                                      border: "none",
                                      backgroundColor: "#37c713",
                                      color: "#fff",
                                    }}
                                  >
                                    Agregar
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableSkeleton columns={columns.length} rows={5} />
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                  <Paginacion
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onNextPage={handleNextPage}
                    onPreviousPage={handlePreviousPage}
                  />
                </div>
              </div>
            </div>

            <div
              style={{
                width: "49%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}
              id="derecha"
            >
              {/* Tabla de productos seleccionados */}
              <div
                style={{
                  flex: "0 1 80%",
                  overflowY: "auto",
                }}
              >
                <h3 style={{ marginBottom: "10px" }}>
                  Productos Seleccionados
                </h3>
                <br />
                <div>
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                    }}
                  >
                    <thead style={{ textAlign: "center" }}>
                      <tr>
                        <th style={{ width: "40%" }}>Producto</th>
                        <th style={{ width: "20%" }}>Cantidad</th>
                        <th style={{ width: "15%" }}>Precio</th>
                        <th style={{ width: "15%" }}>Total</th>
                        <th style={{ width: "10%" }}>Acc</th>
                      </tr>
                    </thead>
                    <br />
                    <tbody>
                      {productosSeleccionados.map((producto, index) => (
                        <React.Fragment key={producto.productoId}>
                          <tr
                            style={{
                              textAlign: "center",
                              padding: "10px 0",
                              height: "20px",
                            }}
                          >
                            <td>{producto.nombreProducto}</td>
                            <td>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  gap: "5px",
                                }}
                              >
                                <Button
                                  style={{
                                    backgroundColor: "#880000",
                                    border: "none",
                                    color: "#fff",
                                  }}
                                  icon={<SubtractRegular />}
                                  onClick={() =>
                                    decrementarCantidad(producto.productoId)
                                  }
                                />
                                {producto.cantidad}
                                <Button
                                  style={{
                                    backgroundColor: "#37c713",
                                    border: "none",
                                    color: "#fff",
                                  }}
                                  icon={<AddRegular />}
                                  onClick={() =>
                                    incrementarCantidad(producto.productoId)
                                  }
                                />
                              </div>
                            </td>
                            <td>{producto.precio}</td>
                            <td>{producto.precioTotal.toFixed(2)}</td>
                            <td>
                              <Button
                                style={{
                                  backgroundColor: "#880000",
                                  border: "none",
                                  color: "#fff",
                                }}
                                icon={<DeleteRegular />}
                                onClick={() =>
                                  eliminarProducto(producto.productoId)
                                }
                              />
                            </td>
                          </tr>
                          {index !== productosSeleccionados.length - 1 && (
                            <tr>
                              <br />
                              <td colSpan={5}>
                                <hr />
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Totales y botones */}
              <div
                style={{
                  flex: "0 0 auto",
                  padding: "10px",
                  borderTop: "1px solid gray",
                  marginTop: "10px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "space-between",
                    fontSize: "15px",
                  }}
                >
                  <p>Sub total: S/ {totalProductos.toFixed(2)}</p>
                  <p>IGV (18%): S/ {igv.toFixed(2)}</p>
                  <p>IVA (15%): S/ {iva.toFixed(2)}</p>
                </div>
                <br />
                <p
                  style={{
                    fontSize: "20px",
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  Total: S/ {total.toFixed(2)}
                </p>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "10px",
                    marginTop: "30px",
                  }}
                >
                  <Button
                    style={{
                      backgroundColor: "#8d0900",
                      color: "white",
                      border: "none",
                      padding: "10px",
                    }}
                    onClick={handleClose}
                  >
                    Cancelar
                  </Button>
                  <Button
                    disabled={isButtonDisabled}
                    onClick={() => {
                      registrarPedido();
                    }}
                    style={{
                      border: "none",
                      backgroundColor: !isButtonDisabled
                        ? "#37c713"
                        : "transparent",
                      color: !isButtonDisabled ? "#fff" : "#999",
                      padding: "10px",
                    }}
                  >
                    Registrar Pedido
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DrawerBody>
      </OverlayDrawer>
    </>
  );
};

export default AgregarPedido;
