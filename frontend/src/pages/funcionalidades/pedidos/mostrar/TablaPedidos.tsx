import {
  Button,
  Table,
  TableHeader,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  TableCellLayout,
  SearchBox,
  Option,
  SearchBoxChangeEvent,
  Badge,
  Combobox,
  Toast,
  ToastBody,
  Toaster,
  ToastTitle,
  useToastController,
} from "@fluentui/react-components";
import { useBoolean } from "@fluentui/react-hooks";
import { useEffect, useId, useState } from "react";
import PedidosServices from "../../../services/pedidos/PedidosServices";
import { IPedidos } from "../../../interfaces/IPedidos";
import {
  AddRegular,
  ArrowClockwiseRegular,
  BackspaceRegular,
  CloudArrowUpRegular,
  ContentViewRegular,
  DeleteRegular,
  DismissRegular,
  DocumentPdfRegular,
} from "@fluentui/react-icons";
import Paginacion from "../../../../components/Paginacion";
import { useNavigate } from "react-router-dom";
import TableSkeleton from "../../../../components/TablaCarga";
import AgregarPedido from "../agregar/AgregarPedido";
import PanelDetallePedido from "../detallar/PanelDetallePedido";
import { IEditarEstados, IEstadoPedido } from "../../../interfaces/IClientes";
import EliminarPedido from "../eliminar/EliminarPedido";

const TablaPedidos = () => {
  const navigate = useNavigate();
  const toasterId = useId();
  const { dispatchToast } = useToastController(toasterId);
  const acceso = localStorage.getItem("accesoTotal");
  const [isLoading, setIsLoading] = useState(true);
  const [dataPedido, setDataPedido] = useState<IPedidos[]>([]);
  const [dataEstadoPedido, setDataEstadoPedido] = useState<IEstadoPedido[]>(
    null!
  );
  const [dataComboPedido, setDataComboPedido] = useState<IEstadoPedido[]>(
    null!
  );
  const [dataEditarEstados, setDataEditarEstados] = useState<IEditarEstados>({
    pedidos: [],
  });

  const [estadoPedido, setEstadoPedido] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pedidoId, setPedidoId] = useState("");
  const [empresa, setEmpresa] = useState("");
  const pageSize = 10;
  const [
    isOpenPanelAgregarPedido,
    { setTrue: openPanelAgregarPedido, setFalse: isClosePanelAgregarPedido },
  ] = useBoolean(false);

  const [
    isOpenPanelDetalle,
    { setTrue: openPanelDetalle, setFalse: isClosePanelDetalle },
  ] = useBoolean(false);

  const [
    isOpenPanelEliminarPedido,
    { setTrue: openPanelEliminarPedido, setFalse: isClosePanelEliminarPedido },
  ] = useBoolean(false);

  const _actualizar = () => {
    obtenerPedidos();
  };
  const _retroceder = () => {
    navigate("/principal");
  };

  function editarPedidosLista() {
    PedidosServices.editarEstadosPedidos(dataEditarEstados).then((res) => {
      if (res.status == 200) {
        console.log("Se editaron los estados de pedidos");
        _actualizar();
      }
    });
  }

  function obtenerPedidos(pageNumber = 1) {
    setIsLoading(true);
    PedidosServices.obtenerPedidos(
      estadoPedido,
      empresa,
      pageNumber,
      pageSize
    ).then((res) => {
      if (res.status == 200) {
        setIsLoading(false);
        setDataPedido(res.data.items);
        setTotalPages(res.data.totalPages);
      }
    });
  }

  function obtenerClientes() {
    PedidosServices.obtenerEstadoPedido().then((res) => {
      if (res.status === 200) {
        const dataCat = res.data.map((x: IEstadoPedido) => ({
          key: x.key,
          text: x.text,
        }));
        setDataEstadoPedido(dataCat);
        setDataComboPedido(dataCat);
      }
    });
  }

  function generarPdf(pedido: string) {
    setPedidoId(pedido);
    PedidosServices.generarPedidoPdf(pedido).then((res) => {
      if (res.status == 200) {
        mostrarToast();
      }
    });
  }

  const capturarRazonSocial = (event: SearchBoxChangeEvent) => {
    const target = event.target as HTMLInputElement;
    setEmpresa(target.value);
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

  const capturarNombre = (event: SearchBoxChangeEvent) => {
    const target = event.target as HTMLInputElement;
    setEstadoPedido(target.value);
  };

  const handleEstadoChange = (pedidoId: string, event: any, option: any) => {
    const estadoPedidoId = option.optionValue;
    console.log(pedidoId);
    const existingPedido = dataEditarEstados.pedidos.find(
      (p) => p.pedidoId === pedidoId
    );

    if (existingPedido) {
      setDataEditarEstados((prevState) => ({
        pedidos: prevState.pedidos.map((p) =>
          p.pedidoId === pedidoId ? { ...p, estadoPedidoId } : p
        ),
      }));
    } else {
      setDataEditarEstados((prevState) => ({
        pedidos: [...prevState.pedidos, { pedidoId, estadoPedidoId }],
      }));
    }
  };

  const handleClienteChange = (event: any, option: any) => {
    setEstadoPedido(option.optionValue);
  };

  const handleLimpiar = () => {
    setEstadoPedido(null!);
  };

  const mostrarToast = () => {
    dispatchToast(
      <Toast>
        <ToastTitle>¡PDF Generado!</ToastTitle>
        <ToastBody>Se generó el documento PDF en Descargas</ToastBody>
      </Toast>,
      { intent: "success" }
    );
  };

  const columns = [
    { columnKey: "cliente", label: "Cliente" },
    { columnKey: "fechaPedido", label: "Fecha Pedido" },
    { columnKey: "estado", label: "Estado" },
    { columnKey: "creadoPor", label: "Creado Por" },
    { columnKey: "total", label: "Total (Inc. IGV)" },
    ...(acceso == "1" ? [{ columnKey: "confirmar", label: "Estado" }] : []),
    { columnKey: "opciones", label: "Opciones" },
  ];

  useEffect(() => {
    obtenerPedidos();
  }, [currentPage, empresa, estadoPedido]);

  useEffect(() => {
    obtenerClientes();
  }, []);

  useEffect(() => {
    if (dataEditarEstados.pedidos.length > 0) {
      console.log("Data a enviar:", dataEditarEstados);
    }
  }, [dataEditarEstados]);

  return (
    <>
      <div
        style={{
          marginTop: "10vh",
          width: "80%",
          margin: "auto",
          height: "80vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ flex: "1 1 auto", overflowY: "auto" }}>
          <h2 id="tituloTabla">Lista de pedidos</h2>
          <br />
          <br />
          <div
            style={{
              display: "flex",
              gap: "15px",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", gap: "15px" }}>
              <Button
                onClick={_retroceder}
                style={{
                  backgroundColor: "#720e0e",
                  border: "none",
                  marginBottom: "10px",
                }}
                icon={<BackspaceRegular />}
              >
                Atrás
              </Button>

              <Button
                onClick={_actualizar}
                style={{
                  backgroundColor: "#2985ee",
                  border: "none",
                  marginBottom: "10px",
                }}
                icon={<ArrowClockwiseRegular />}
              >
                Actualizar
              </Button>

              <Button
                onClick={openPanelAgregarPedido}
                style={{
                  backgroundColor: "#37c713",
                  border: "none",
                  marginBottom: "10px",
                }}
                icon={<AddRegular />}
              >
                Nuevo Pedido
              </Button>

              {dataPedido && dataPedido.length > 0 && (
                <Button
                  icon={<CloudArrowUpRegular />}
                  onClick={editarPedidosLista}
                  style={{
                    backgroundColor: "#37b4aa",
                    border: "none",
                    marginBottom: "10px",
                  }}
                >
                  Guardar Cambios
                </Button>
              )}
            </div>

            <div
              style={{
                display: "flex",
                gap: "15px",
                width: "45%",
                alignItems: "center",
                marginLeft: "auto",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "10px",
                }}
              >
                <Combobox
                  style={{ width: "100%" }}
                  placeholder="Filtrar por estado"
                  onChange={capturarNombre}
                  onOptionSelect={handleClienteChange}
                >
                  {dataEstadoPedido?.map((option) => (
                    <Option
                      key={option.key}
                      text={option.text}
                      value={option.key}
                    >
                      {option?.text}
                    </Option>
                  ))}
                </Combobox>

                <DismissRegular
                  onClick={handleLimpiar}
                  style={{ fontSize: "25px", cursor: "pointer" }}
                />
              </div>
              <SearchBox
                style={{
                  marginBottom: "10px",
                  width: "49%",
                  height: "10%",
                }}
                onChange={capturarRazonSocial}
                placeholder="Búsqueda por ruc o razón social"
              />
            </div>
          </div>

          <div>
            {/* <pre>{JSON.stringify(dataEditarEstados, null, 2)}</pre> */}
            <Table role="grid" aria-label="Table with grid keyboard navigation">
              <TableHeader>
                <TableRow>
                  {columns.map((column) => (
                    <TableHeaderCell
                      style={{
                        width:
                          column.columnKey === "confirmar" ? "220px" : "150px",
                      }}
                      key={column.columnKey}
                    >
                      {column.label}
                    </TableHeaderCell>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {!isLoading ? (
                  dataPedido.map((item) => (
                    <TableRow key={item.pedidoId}>
                      <TableCell tabIndex={0} role="gridcell">
                        <TableCellLayout>{item.razonSocial}</TableCellLayout>
                      </TableCell>
                      <TableCell tabIndex={0} role="gridcell">
                        <TableCellLayout>
                          {item.fechaPedido} {item.horaPedido}
                        </TableCellLayout>
                      </TableCell>
                      <TableCell
                        style={{
                          display: "flex",
                          gap: "10px",
                          alignItems: "center",
                        }}
                        tabIndex={0}
                        role="gridcell"
                      >
                        <Badge
                          style={{ width: "8px", height: "12px" }}
                          appearance="filled"
                          color={
                            item.estadoPedido === "Aprobado"
                              ? "success"
                              : item.estadoPedido === "Pendiente"
                              ? "warning"
                              : "danger"
                          }
                        />
                        <TableCellLayout>{item.estadoPedido}</TableCellLayout>
                      </TableCell>
                      <TableCell tabIndex={0} role="gridcell">
                        <TableCellLayout>{item.creadoPor}</TableCellLayout>
                      </TableCell>
                      <TableCell tabIndex={0} role="gridcell">
                        <TableCellLayout>S/ {item.total}</TableCellLayout>
                      </TableCell>

                      {acceso == "1" && (
                        <TableCell
                          data-label="Confirmar"
                          style={{
                            display: "flex",
                          }}
                          role="gridcell"
                          tabIndex={0}
                        >
                          <TableCellLayout>
                            <Combobox
                              style={{ width: "100%" }}
                              placeholder="Confirmar estado"
                              onOptionSelect={(event, option) =>
                                handleEstadoChange(item.pedidoId, event, option)
                              }
                            >
                              {dataComboPedido?.map((option) => (
                                <Option
                                  key={option.key}
                                  text={option.text}
                                  value={option.key}
                                >
                                  {option.text}
                                </Option>
                              ))}
                            </Combobox>
                          </TableCellLayout>
                        </TableCell>
                      )}

                      <TableCell tabIndex={0} role="gridcell">
                        <TableCellLayout>
                          <Button
                            icon={<ContentViewRegular />}
                            style={{
                              border: "none",
                              backgroundColor: "#307ed6",
                            }}
                            title="Detalle de pedido"
                            onClick={() => {
                              if (item.pedidoId) {
                                setPedidoId(item.pedidoId);
                                openPanelDetalle();
                              } else {
                                console.error("PedidoId is undefined");
                              }
                            }}
                            aria-label="Detalle"
                          />
                          {item.estadoPedido == "Aprobado" && acceso == "1" && (
                            <Button
                              icon={<DocumentPdfRegular />}
                              style={{
                                border: "none",
                                backgroundColor: "#ca1919",
                              }}
                              title="Generar PDF"
                              onClick={() => {
                                if (item.pedidoId) {
                                  setPedidoId(item.pedidoId);
                                  generarPdf(item.pedidoId);
                                } else {
                                  console.error("PedidoId is undefined");
                                }
                              }}
                              aria-label="GenerarPdf"
                            />
                          )}

                          {item.estadoPedido == "Rechazado" && (
                            <Button
                              icon={<DeleteRegular />}
                              style={{
                                border: "none",
                                backgroundColor: "#b92d2d",
                              }}
                              title="Eliminar Pedido"
                              onClick={() => {
                                if (item.pedidoId) {
                                  setPedidoId(item.pedidoId);
                                  openPanelEliminarPedido();
                                } else {
                                  console.error("PedidoId is undefined");
                                }
                              }}
                              aria-label="Eliminar"
                            />
                          )}
                        </TableCellLayout>
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

        <AgregarPedido
          isOpen={isOpenPanelAgregarPedido}
          isClose={isClosePanelAgregarPedido}
          reload={_actualizar}
        />

        <PanelDetallePedido
          isOpen={isOpenPanelDetalle}
          isClose={isClosePanelDetalle}
          pedidoId={pedidoId}
        />

        <EliminarPedido
          isOpen={isOpenPanelEliminarPedido}
          isClose={isClosePanelEliminarPedido}
          reload={_actualizar}
          id={pedidoId}
        />

        <Toaster toasterId={toasterId} />
      </div>
    </>
  );
};

export default TablaPedidos;
