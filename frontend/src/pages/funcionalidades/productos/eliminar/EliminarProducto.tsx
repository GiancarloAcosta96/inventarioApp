import {
  Dialog,
  DialogSurface,
  DialogBody,
  DialogTitle,
  DialogContent,
  Input,
  DialogActions,
  DialogTrigger,
  Button,
  Label,
  Textarea,
  Spinner,
} from "@fluentui/react-components";
import React, { useEffect, useState } from "react";
import {
  IAgregarProducto,
  IEliminarProducto,
} from "../../../interfaces/IProductos";
import ProductosServices from "../../../services/productos/ProductosServices";
import {
  CheckmarkCircleRegular,
  ErrorCircleRegular,
} from "@fluentui/react-icons";
import {
  IAgregar,
  IEditar,
  IEliminar,
} from "../../../../components/InterfaceProps";

const EliminarProducto: React.FC<IEliminar> = ({
  isOpen,
  isClose,
  reload,
  id,
}) => {
  const [respuesta, setRespuesta] = useState({
    message: "",
    success: false,
    title: "",
  });
  const [mostrarCuerpo, setMostrarCuerpo] = useState(false);
  const [mostrarMensaje, setMostrarMensaje] = useState(false);
  const [mostrarSpinner, setMostrarSpinner] = useState(false);
  const [dataEliminarProd, setDataEliminarProd] = useState<IEliminarProducto>({
    productoId: "",
  });

  function eliminarProducto() {
    setMostrarSpinner(true);
    setMostrarCuerpo(true);
    ProductosServices.eliminarProducto(dataEliminarProd)
      .then((res) => {
        if (res.data) {
          reload();
          setRespuesta(res.data);
          setMostrarSpinner(false);
          setMostrarMensaje(true);
          setTimeout(() => {
            handleCerar();
            setTimeout(() => {
              setMostrarCuerpo(false);
              setMostrarMensaje(false);
            }, 1800);
          }, 2000);
        } else {
          setRespuesta(res.data);
        }
      })
      .catch((error) => {
        const errorMessage = error.response?.data ?? {
          title: "Error",
          message: "Ocurrió un error inesperado.",
          succes: false,
        };
        setRespuesta(errorMessage);
        setMostrarSpinner(false);
        setMostrarMensaje(true);
        setTimeout(() => {
          handleCerar();
          setTimeout(() => {
            setMostrarCuerpo(false);
            setMostrarMensaje(false);
          }, 1800);
        }, 1000);
      });
  }

  const limpiar = () => {
    setDataEliminarProd({
      productoId: "",
    });
  };

  const handleCerar = () => {
    isClose();
    limpiar();
  };

  useEffect(() => {
    setDataEliminarProd({
      productoId: id,
    });
  }, [id]);

  return (
    <>
      <Dialog open={isOpen}>
        <DialogSurface>
          <div
            style={{
              width: "100%",
              justifyContent: "center",
              display: mostrarSpinner ? "flex" : "none",
            }}
          >
            <DialogBody>
              <Spinner size="medium"></Spinner>
            </DialogBody>
          </div>

          <div hidden={mostrarCuerpo}>
            <DialogBody>
              {/* <pre>{JSON.stringify(id, null, 2)}</pre> */}
              <DialogTitle>Eliminar Producto</DialogTitle>
              <DialogContent>¿Desea eliminar el producto?</DialogContent>
              <DialogActions>
                <DialogTrigger disableButtonEnhancement>
                  <Button onClick={handleCerar} appearance="secondary">
                    Cerrar
                  </Button>
                </DialogTrigger>
                <Button
                  onClick={eliminarProducto}
                  style={{
                    backgroundColor: "#ac1919",
                    color: "#fff",
                  }}
                >
                  Eliminar
                </Button>
              </DialogActions>
            </DialogBody>
          </div>

          <div hidden={!mostrarMensaje}>
            <DialogBody>
              <DialogTitle
                style={{ display: "flex", alignContent: "center", gap: "10px" }}
              >
                {respuesta?.success ? (
                  <CheckmarkCircleRegular
                    style={{
                      fontSize: "30px",
                      color: "#07c510",
                    }}
                  />
                ) : (
                  <ErrorCircleRegular
                    style={{ fontSize: "30px", color: "#ff0000" }}
                  />
                )}
                {respuesta?.title}
              </DialogTitle>
              <DialogContent>{respuesta?.message}</DialogContent>
            </DialogBody>
          </div>
        </DialogSurface>
      </Dialog>
    </>
  );
};

export default EliminarProducto;
