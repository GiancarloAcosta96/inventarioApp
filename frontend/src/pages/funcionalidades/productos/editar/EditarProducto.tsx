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
import { IEditarProducto } from "../../../interfaces/IProductos";
import ProductosServices from "../../../services/productos/ProductosServices";
import {
  CheckmarkCircleRegular,
  ErrorCircleRegular,
} from "@fluentui/react-icons";
import { IEditar } from "../../../../components/InterfaceProps";

const EditarProducto: React.FC<IEditar> = ({ isOpen, isClose, reload, id }) => {
  const [respuesta, setRespuesta] = useState({
    message: "",
    success: false,
    title: "",
  });
  const [validarInfo, setValidarInfo] = useState<any>();
  const [mostrarCuerpo, setMostrarCuerpo] = useState(false);
  const [mostrarMensaje, setMostrarMensaje] = useState(false);
  const [mostrarSpinner, setMostrarSpinner] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [dataEditarProducto, setDataEditarProducto] = useState<IEditarProducto>(
    {
      productoId: "",
      nombreProducto: "",
      descripcion: "",
      precio: 0,
      cantidadStock: 0,
    }
  );

  function detalleProducto() {
    ProductosServices.detalleProducto(id).then((res) => {
      if (res.status == 200) {
        const aux = res.data;
        setDataEditarProducto({
          ...dataEditarProducto,
          productoId: aux.productoId,
          nombreProducto: aux.nombreProducto,
          descripcion: aux.descripcion,
          precio: aux.precio,
          cantidadStock: aux.cantidadStock,
        });
      } else {
        setDataEditarProducto({
          productoId: "",
          nombreProducto: "",
          descripcion: "",
          precio: 0,
          cantidadStock: 0,
        });
      }
    });
  }

  const infoEditar = () => {
    if (dataEditarProducto) {
      if (
        validarInfo == null ||
        validarInfo == undefined ||
        validarInfo.nombreProducto == "" ||
        validarInfo.descripcion == "" ||
        validarInfo.precio == 0 ||
        validarInfo.cantidadStock == 0
      ) {
        setValidarInfo(dataEditarProducto);
      }
    }
  };

  const validarForm = () => {
    if (dataEditarProducto && validarInfo) {
      const camposIguales =
        dataEditarProducto.nombreProducto === validarInfo.nombreProducto &&
        dataEditarProducto.descripcion === validarInfo.descripcion &&
        dataEditarProducto.precio === validarInfo.precio &&
        dataEditarProducto.cantidadStock === validarInfo.cantidadStock;
      const valoresValidos =
        dataEditarProducto.precio > 0 && dataEditarProducto.cantidadStock > 0;
      setIsButtonDisabled(camposIguales || !valoresValidos);
    }
  };

  function editarProducto() {
    setMostrarSpinner(true);
    setMostrarCuerpo(true);
    ProductosServices.editarProducto(dataEditarProducto)
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
    setDataEditarProducto({
      productoId: "",
      nombreProducto: "",
      descripcion: "",
      precio: 0,
      cantidadStock: 0,
    });
    setValidarInfo(null!);
  };

  const handleCerar = () => {
    isClose();
    limpiar();
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    switch (name) {
      case "nombreProducto":
        setDataEditarProducto((prevData) => ({
          ...prevData,
          nombreProducto: value,
        }));
        break;

      case "descripcion":
        setDataEditarProducto((prevData) => ({
          ...prevData,
          descripcion: value,
        }));
        break;

      case "precio":
        const precio = parseFloat(value);
        if (!isNaN(precio) && precio >= 0) {
          setDataEditarProducto((prevData) => ({
            ...prevData,
            precio,
          }));
        }
        break;

      case "cantidadStock":
        setDataEditarProducto((prevData) => ({
          ...prevData,
          cantidadStock: parseInt(value) || 0,
        }));
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    detalleProducto();
  }, [id]);

  useEffect(() => {
    validarForm();
  }, [validarInfo, dataEditarProducto]);

  useEffect(() => {
    infoEditar();
  }, [dataEditarProducto, validarInfo]);

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
              <DialogTitle>Editar Producto</DialogTitle>
              <DialogContent>
                {/* <pre>{JSON.stringify(dataEditarProducto, null, 2)}</pre>
                <pre>{JSON.stringify(validarInfo, null, 2)}</pre>
                <pre>{JSON.stringify(isButtonDisabled, null, 2)}</pre> */}
                <br />
                <Label>Nombre</Label>
                <Input
                  name="nombreProducto"
                  style={{ display: "flex", flexDirection: "column" }}
                  value={dataEditarProducto?.nombreProducto ?? ""}
                  onChange={handleInputChange}
                />
                <br />
                <Label>Descripción</Label>
                <Textarea
                  name="descripcion"
                  style={{ display: "flex", flexDirection: "column" }}
                  value={dataEditarProducto?.descripcion ?? ""}
                  onChange={handleInputChange}
                />
                <br />

                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ width: "49%" }}>
                    <Label>Precio</Label>
                    <Input
                      type="number"
                      name="precio"
                      step="0.01"
                      style={{ display: "flex", flexDirection: "column" }}
                      value={dataEditarProducto?.precio.toString() ?? 0}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div style={{ width: "49%" }}>
                    <Label>Cantidad en stock</Label>
                    <Input
                      name="cantidadStock"
                      style={{ display: "flex", flexDirection: "column" }}
                      value={dataEditarProducto?.cantidadStock.toString() ?? 0}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <br />
              </DialogContent>
              <DialogActions>
                <DialogTrigger disableButtonEnhancement>
                  <Button onClick={handleCerar} appearance="secondary">
                    Cerrar
                  </Button>
                </DialogTrigger>
                <Button
                  disabled={isButtonDisabled}
                  onClick={editarProducto}
                  style={{
                    backgroundColor: !isButtonDisabled ? "#219142" : "#7c7c7c",
                    color: !isButtonDisabled ? "#fff" : "#444",
                  }}
                >
                  Editar
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

export default EditarProducto;
