import {
  Button,
  Table,
  TableHeader,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  TableCellLayout,
  Text,
} from "@fluentui/react-components";
import { useBoolean } from "@fluentui/react-hooks";
import { useEffect, useState } from "react";
import PedidosServices from "../../../services/pedidos/PedidosServices";
import { IPedidos } from "../../../interfaces/IPedidos";
import {
  AddRegular,
  ArrowClockwiseRegular,
  ArrowLeftRegular,
  ArrowRightRegular,
  BackspaceRegular,
  EditRegular,
} from "@fluentui/react-icons";
import Paginacion from "../../../../components/Paginacion";
import { useNavigate } from "react-router-dom";
import { IProductos } from "../../../interfaces/IProductos";
import ProductosServices from "../../../services/productos/ProductosServices";
import ClientesServices from "../../../services/clientes/ClientesServices";
import { IClientes } from "../../../interfaces/IClientes";
import { IUsuarios } from "../../../interfaces/IUsuarios";
import UsuariosServices from "../../../services/usuarios/UsuariosServices";
import { IRoles } from "../../../interfaces/IRoles";
import RolesServices from "../../../services/roles/RolesServices";
import TableSkeleton from "../../../../components/TablaCarga";
import AgregarRol from "../agregar/AgregarRol";
import EditarRol from "../editar/EditarRol";

const TablaRoles = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [dataRoles, setDataRoles] = useState<IRoles[]>([]);
  const [rolId, setRolId] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [
    isOpenPanelEditarRol,
    { setTrue: openPanelEditarRol, setFalse: isClosePanelEditarRol },
  ] = useBoolean(false);
  const [
    isOpenPanelAgregarRol,
    { setTrue: openPanelAgregarRol, setFalse: isClosePanelAgregarRol },
  ] = useBoolean(false);

  const _actualizar = () => {
    obtenerRoles();
  };
  const _retroceder = () => {
    navigate("/principal");
  };

  function obtenerRoles(pageNumber = 1) {
    setIsLoading(true);
    RolesServices.obtenerRoles("", pageNumber, pageSize).then((res) => {
      if (res.status == 200) {
        setIsLoading(false);
        setDataRoles(res.data.items);
        setTotalPages(res.data.totalPages);
      }
    });
  }

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
    { columnKey: "nombreRol", label: "Nombre Rol" },
    { columnKey: "accesoTotal", label: "Acceso Total" },
    { columnKey: "opciones", label: "Opciones" },
  ];

  useEffect(() => {
    obtenerRoles();
  }, [currentPage]);

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
          <h2 id="tituloTabla">Lista de roles</h2>
          <br />
          <br />
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
              onClick={openPanelAgregarRol}
              style={{
                backgroundColor: "#37c713",
                border: "none",
                marginBottom: "10px",
              }}
              icon={<AddRegular />}
            >
              Nuevo Rol
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
                dataRoles.map((item) => (
                  <TableRow key={item.rolId}>
                    <TableCell tabIndex={0} role="gridcell">
                      <TableCellLayout>{item.nombreRol}</TableCellLayout>
                    </TableCell>
                    <TableCell tabIndex={0} role="gridcell">
                      <TableCellLayout>
                        {item.accesoTotal ? "Sí" : "No"}
                      </TableCellLayout>
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
                          title="Editar Rol"
                          onClick={() => {
                            if (item.rolId) {
                              setRolId(item.rolId);
                              openPanelEditarRol();
                            } else {
                              console.error("RolId is undefined");
                            }
                          }}
                          aria-label="Editar"
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

        <AgregarRol
          isOpen={isOpenPanelAgregarRol}
          isClose={isClosePanelAgregarRol}
          reload={_actualizar}
        />

        <EditarRol
          isOpen={isOpenPanelEditarRol}
          isClose={isClosePanelEditarRol}
          reload={_actualizar}
          id={rolId}
        />
      </div>
    </>
  );
};

export default TablaRoles;
