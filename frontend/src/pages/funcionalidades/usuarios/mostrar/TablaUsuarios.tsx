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
import { IUsuarios } from "../../../interfaces/IUsuarios";
import UsuariosServices from "../../../services/usuarios/UsuariosServices";
import TableSkeleton from "../../../../components/TablaCarga";
import AgregarUsuario from "../agregar/AgregarUsuario";
import EditarUsuario from "../editar/EditarUsuario";

const TablaUsuarios = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [usuarioId, setUsuarioId] = useState("");
  const [dataUsuarios, setDataUsuarios] = useState<IUsuarios[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [nombre, setNombre] = useState("");
  const pageSize = 10;
  const [
    isOpenPanelAgregarUsuario,
    { setTrue: openPanelAgregarUsuario, setFalse: isClosePanelAgregarUsuario },
  ] = useBoolean(false);

  const [
    isOpenPanelEditarUsuario,
    { setTrue: openPanelEditarUsuario, setFalse: isClosePanelEditarUsuario },
  ] = useBoolean(false);

  const _actualizar = () => {
    obtenerUsuarios();
  };
  const _retroceder = () => {
    navigate("/principal");
  };

  function obtenerUsuarios(pageNumber = 1) {
    setIsLoading(true);
    UsuariosServices.obtenerUsuarios(nombre, pageNumber, pageSize).then(
      (res) => {
        if (res.status == 200) {
          setIsLoading(false);
          setDataUsuarios(res.data.items);
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
    { columnKey: "nombres", label: "Nombre" },
    { columnKey: "nombreUsuario", label: "Nombre de Usuario" },
    { columnKey: "correo", label: "Correo" },
    { columnKey: "fechaRegistro", label: "Fecha de registro" },
    { columnKey: "rol", label: "Rol" },
    { columnKey: "opciones", label: "Opciones" },
  ];

  useEffect(() => {
    obtenerUsuarios();
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
          <h2 id="tituloTabla">Lista de usuarios</h2>
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
                onClick={openPanelAgregarUsuario}
                style={{
                  backgroundColor: "#37c713",
                  border: "none",
                  marginBottom: "10px",
                }}
                icon={<AddRegular />}
              >
                Nuevo Usuario
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

            <SearchBox
              style={{
                marginBottom: "10px",
                width: "25%",
                height: "10%",
                marginRight: "2%",
              }}
              onChange={capturarNombre}
              placeholder="Búsqueda por nombre de usuario o email"
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
                dataUsuarios.map((item) => (
                  <TableRow key={item.usuarioId}>
                    <TableCell tabIndex={0} role="gridcell">
                      <TableCellLayout>{item.nombre}</TableCellLayout>
                    </TableCell>
                    <TableCell tabIndex={0} role="gridcell">
                      <TableCellLayout>{item.nombreUsuario}</TableCellLayout>
                    </TableCell>
                    <TableCell tabIndex={0} role="gridcell">
                      <TableCellLayout>{item.email}</TableCellLayout>
                    </TableCell>
                    <TableCell tabIndex={0} role="gridcell">
                      <TableCellLayout>{item.fechaRegistro}</TableCellLayout>
                    </TableCell>
                    <TableCell tabIndex={0} role="gridcell">
                      <TableCellLayout>{item.rol}</TableCellLayout>
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
                          title="Editar Producto"
                          onClick={() => {
                            if (item.usuarioId) {
                              setUsuarioId(item.usuarioId);
                              openPanelEditarUsuario();
                            } else {
                              console.error("UsuarioId is undefined");
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

        <AgregarUsuario
          isOpen={isOpenPanelAgregarUsuario}
          isClose={isClosePanelAgregarUsuario}
          reload={_actualizar}
        />

        <EditarUsuario
          isOpen={isOpenPanelEditarUsuario}
          isClose={isClosePanelEditarUsuario}
          reload={_actualizar}
          id={usuarioId}
        />
      </div>
    </>
  );
};

export default TablaUsuarios;
