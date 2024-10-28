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
  Spinner,
  Skeleton,
  SkeletonItem,
  makeStyles,
  tokens,
} from "@fluentui/react-components";
import { useBoolean } from "@fluentui/react-hooks";
import { useEffect, useState } from "react";
import {
  AddRegular,
  ArrowClockwiseRegular,
  BackspaceRegular,
  DeleteRegular,
  EditRegular,
} from "@fluentui/react-icons";
import Paginacion from "../../../../components/Paginacion";
import { useNavigate } from "react-router-dom";
import { IDataInventario, IProductos } from "../../../interfaces/IProductos";
import ProductosServices from "../../../services/productos/ProductosServices";
import TableSkeleton from "../../../../components/TablaCarga";
import AgregarProducto from "../agregar/AgregarProducto";
import EditarProducto from "../editar/EditarProducto";
import EliminarProducto from "../eliminar/EliminarProducto";

const TablaProductos = () => {
  const navigate = useNavigate();
  const [dataInventario, setDataInventario] = useState<IDataInventario>({
    totalProducto: 0,
    totalInventario: 0,
    promedioInventario: 0,
    cantidadPedidosPendientes: 0,
    cantidadPedidosAprobados: 0,
  });
  const [dataProductos, setDataProductos] = useState<IProductos[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [nombre, setNombre] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [productoId, setProductoId] = useState("");
  const pageSize = 10;
  const [
    isOpenPanelAgregarProducto,
    {
      setTrue: openPanelAgregarProducto,
      setFalse: isClosePanelAgregarProducto,
    },
  ] = useBoolean(false);
  const [
    isOpenPanelEditarProducto,
    { setTrue: openPanelEditarProducto, setFalse: isClosePanelEditarProducto },
  ] = useBoolean(false);
  const [
    isOpenPanelEliminarProducto,
    {
      setTrue: openPanelEliminarProducto,
      setFalse: isClosePanelEliminarProducto,
    },
  ] = useBoolean(false);

  const _actualizar = () => {
    obtenerProductos();
  };
  const _retroceder = () => {
    navigate("/principal");
  };

  function obtenerDatos() {
    ProductosServices.obtenerInventario().then((res) => {
      if (res.status == 200) {
        setDataInventario(res.data);
      }
    });
  }

  function obtenerProductos(pageNumber = 1) {
    setIsLoading(true);
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
    { columnKey: "nombreProducto", label: "Producto" },
    { columnKey: "descripción", label: "Descripción" },
    { columnKey: "precio", label: "Precio" },
    { columnKey: "cantidadStock", label: "Cantidad en Stock" },
    { columnKey: "opciones", label: "Opciones" },
  ];

  useEffect(() => {
    obtenerProductos(currentPage);
  }, [currentPage, nombre]);

  useEffect(() => {
    obtenerDatos();
  }, [dataProductos]);

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
          <h2 id="tituloTabla">Lista de productos</h2>
          <br />
          <br />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "15px",
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
                onClick={openPanelAgregarProducto}
                style={{
                  backgroundColor: "#37c713",
                  border: "none",
                  marginBottom: "10px",
                }}
                icon={<AddRegular />}
              >
                Nuevo Producto
              </Button>
            </div>

            <div style={{ display: "flex", gap: "20px", marginBottom: "15px" }}>
              <h2>Total stock: S/ {dataInventario?.totalInventario}</h2>
              <h2>
                Promedio de precio: S/ {dataInventario?.promedioInventario}
              </h2>
            </div>

            <SearchBox
              style={{
                marginBottom: "10px",
                width: "25%",
                height: "10%",
                marginRight: "2%",
              }}
              onChange={capturarNombre}
              placeholder="Búsqueda por nombre"
            />
          </div>

          <div>
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
                  dataProductos.map((item) => (
                    <TableRow key={item.productoId}>
                      <TableCell tabIndex={0} role="gridcell">
                        <TableCellLayout>{item.nombreProducto}</TableCellLayout>
                      </TableCell>
                      <TableCell tabIndex={0} role="gridcell">
                        <TableCellLayout>{item.descripcion}</TableCellLayout>
                      </TableCell>
                      <TableCell tabIndex={0} role="gridcell">
                        <TableCellLayout>S/ {item.precio}</TableCellLayout>
                      </TableCell>
                      <TableCell tabIndex={0} role="gridcell">
                        <TableCellLayout>{item.cantidadStock}</TableCellLayout>
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
                              backgroundColor: "#37c713",
                            }}
                            title="Editar Producto"
                            onClick={() => {
                              if (item.productoId) {
                                setProductoId(item.productoId);
                                openPanelEditarProducto();
                              } else {
                                console.error("ProductoId is undefined");
                              }
                            }}
                            aria-label="Detalle"
                          />
                          <Button
                            icon={<DeleteRegular />}
                            style={{
                              backgroundColor: "#ac1919",
                            }}
                            title="Eliminar Producto"
                            onClick={() => {
                              if (item.productoId) {
                                setProductoId(item.productoId);
                                openPanelEliminarProducto();
                              } else {
                                console.error("ProductoId is undefined");
                              }
                            }}
                            aria-label="Eliminar"
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
        </div>

        <Paginacion
          currentPage={currentPage}
          totalPages={totalPages}
          onNextPage={handleNextPage}
          onPreviousPage={handlePreviousPage}
        />

        <AgregarProducto
          isOpen={isOpenPanelAgregarProducto}
          isClose={isClosePanelAgregarProducto}
          reload={_actualizar}
        />

        <EditarProducto
          isOpen={isOpenPanelEditarProducto}
          isClose={isClosePanelEditarProducto}
          reload={_actualizar}
          id={productoId}
        />

        <EliminarProducto
          isOpen={isOpenPanelEliminarProducto}
          isClose={isClosePanelEliminarProducto}
          reload={_actualizar}
          id={productoId}
        />
      </div>
    </>
  );
};

export default TablaProductos;
