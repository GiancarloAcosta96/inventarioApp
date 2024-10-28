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
  SearchBoxChangeEvent,
} from "@fluentui/react-components";
import { useBoolean } from "@fluentui/react-hooks";
import { useEffect, useState } from "react";
import {
  AddRegular,
  ArrowClockwiseRegular,
  BackspaceRegular,
  EditRegular,
} from "@fluentui/react-icons";
import Paginacion from "../../../../components/Paginacion";
import { useNavigate } from "react-router-dom";
import ClientesServices from "../../../services/clientes/ClientesServices";
import { IClientes } from "../../../interfaces/IClientes";
import TableSkeleton from "../../../../components/TablaCarga";
import AgregarCliente from "../agregar/AgregarCliente";
import EditarCliente from "../editar/EditarCliente";

const TablaClientes = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [dataClientes, setDataClientes] = useState<IClientes[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [clienteId, setClienteId] = useState("");
  const [nombre, setNombre] = useState("");
  const pageSize = 10;
  const [
    isOpenPanelAgregarCliente,
    { setTrue: openPanelAgregarCliente, setFalse: isClosePanelAgregarCliente },
  ] = useBoolean(false);
  const [
    isOpenPanelEditarCliente,
    { setTrue: openPanelEditarCliente, setFalse: isClosePanelEditarCliente },
  ] = useBoolean(false);

  const _actualizar = () => {
    obtenerClientes();
  };
  const _retroceder = () => {
    navigate("/principal");
  };

  function obtenerClientes(pageNumber = 1) {
    setIsLoading(true);
    ClientesServices.obtenerClientes(nombre, pageNumber, pageSize).then(
      (res) => {
        if (res.status == 200) {
          setIsLoading(false);
          setDataClientes(res.data.items);
          setTotalPages(res.data.totalPages);
        }
      }
    );
  }

  const capturarNombre = (event: SearchBoxChangeEvent) => {
    const target = event.target as HTMLInputElement;
    setNombre(target.value);
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

  const columns = [
    { columnKey: "ruc", label: "RUC" },
    { columnKey: "razonSocial", label: "Razón Social" },
    { columnKey: "direccion", label: "Dirección" },
    { columnKey: "opciones", label: "Opciones" },
  ];

  useEffect(() => {
    obtenerClientes();
  }, [currentPage, nombre]);

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
          <h2 id="tituloTabla">Lista de clientes</h2>
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
                onClick={openPanelAgregarCliente}
                style={{
                  backgroundColor: "#37c713",
                  border: "none",
                  marginBottom: "10px",
                }}
                icon={<AddRegular />}
              >
                Nuevo Cliente
              </Button>
            </div>

            <SearchBox
              style={{
                marginBottom: "10px",
                width: "25%",
                height: "10%",
                marginRight: "2%",
              }}
              onChange={capturarNombre}
              placeholder="Búsqueda por ruc o razón social"
            />
          </div>

          <Table role="grid" aria-label="Table with grid keyboard navigation">
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
                dataClientes.map((item) => (
                  <TableRow key={item.clienteId}>
                    <TableCell tabIndex={0} role="gridcell">
                      <TableCellLayout>{item.ruc}</TableCellLayout>
                    </TableCell>
                    <TableCell tabIndex={0} role="gridcell">
                      <TableCellLayout>{item.razonSocial}</TableCellLayout>
                    </TableCell>
                    <TableCell tabIndex={0} role="gridcell">
                      <TableCellLayout>{item.direccion}</TableCellLayout>
                    </TableCell>
                    <TableCell
                      data-label="Acciones"
                      style={{ display: "flex" }}
                      role="gridcell"
                      tabIndex={0}
                    >
                      <TableCellLayout>
                        <Button
                          icon={<EditRegular />}
                          style={{
                            color: "#000",
                            backgroundColor: "#37c713",
                          }}
                          title="Editar Cliente"
                          onClick={() => {
                            if (item.clienteId) {
                              setClienteId(item.clienteId);
                              openPanelEditarCliente();
                            } else {
                              console.error("ProductoId is undefined");
                            }
                          }}
                          aria-label="Detalle"
                        />
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

        <Paginacion
          currentPage={currentPage}
          totalPages={totalPages}
          onNextPage={handleNextPage}
          onPreviousPage={handlePreviousPage}
        />

        <AgregarCliente
          isOpen={isOpenPanelAgregarCliente}
          isClose={isClosePanelAgregarCliente}
          reload={_actualizar}
        />

        <EditarCliente
          isOpen={isOpenPanelEditarCliente}
          isClose={isClosePanelEditarCliente}
          reload={_actualizar}
          id={clienteId}
        />
      </div>
    </>
  );
};

export default TablaClientes;
