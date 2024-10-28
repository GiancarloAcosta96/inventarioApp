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
import { IAgregarProducto } from "../../../interfaces/IProductos";
import ProductosServices from "../../../services/productos/ProductosServices";
import {
  CheckmarkCircleRegular,
  ErrorCircleRegular,
} from "@fluentui/react-icons";
import { IAgregar } from "../../../../components/InterfaceProps";

const AgregarProducto: React.FC<IAgregar> = ({ isOpen, isClose, reload }) => {
  const [respuesta, setRespuesta] = useState({
    message: "",
    success: false,
    title: "",
  });
  const [mostrarCuerpo, setMostrarCuerpo] = useState(false);
  const [mostrarMensaje, setMostrarMensaje] = useState(false);
  const [mostrarSpinner, setMostrarSpinner] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [dataAgregarProd, setDataAgregarProd] = useState<IAgregarProducto>({
    nombreProducto: "",
    descripcion: "",
    precio: 0,
    cantidadStock: 0,
  });

  function registarProducto() {
    setMostrarSpinner(true);
    setMostrarCuerpo(true);
    ProductosServices.agregarProducto(dataAgregarProd)
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
        console.log(respuesta);
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
    setDataAgregarProd({
      nombreProducto: "",
      descripcion: "",
      precio: 0,
      cantidadStock: 0,
    });
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
        setDataAgregarProd((prevData) => ({
          ...prevData,
          nombreProducto: value,
        }));
        break;

      case "descripcion":
        setDataAgregarProd((prevData) => ({
          ...prevData,
          descripcion: value,
        }));
        break;

      case "precio":
        const precio = parseFloat(value);
        if (!isNaN(precio) && precio >= 0) {
          setDataAgregarProd((prevData) => ({
            ...prevData,
            precio,
          }));
        }
        break;

      case "cantidadStock":
        setDataAgregarProd((prevData) => ({
          ...prevData,
          cantidadStock: parseInt(value) || 0,
        }));
        break;

      default:
        break;
    }
  };

  useEffect(() => {
    const isFormComplete =
      dataAgregarProd.nombreProducto.trim() !== "" &&
      dataAgregarProd.descripcion.trim() !== "" &&
      dataAgregarProd.precio > 0 &&
      dataAgregarProd.cantidadStock > 0;

    setIsButtonDisabled(!isFormComplete);
  }, [dataAgregarProd]);

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
              <DialogTitle>Agregar Nuevo Producto</DialogTitle>
              <DialogContent>
                <br />
                <Label>Nombre</Label>
                <Input
                  name="nombreProducto"
                  style={{ display: "flex", flexDirection: "column" }}
                  value={dataAgregarProd?.nombreProducto ?? ""}
                  onChange={handleInputChange}
                />
                <br />
                <Label>Descripción</Label>
                <Textarea
                  name="descripcion"
                  style={{ display: "flex", flexDirection: "column" }}
                  value={dataAgregarProd?.descripcion ?? ""}
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
                    <Label>Precio (S/)</Label>
                    <Input
                      type="number"
                      name="precio"
                      step="0.01"
                      style={{ display: "flex", flexDirection: "column" }}
                      value={dataAgregarProd?.precio.toString() ?? 0}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div style={{ width: "49%" }}>
                    <Label>Cantidad en stock (S/)</Label>
                    <Input
                      name="cantidadStock"
                      style={{ display: "flex", flexDirection: "column" }}
                      value={dataAgregarProd?.cantidadStock.toString() ?? 0}
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
                  onClick={registarProducto}
                  style={{
                    backgroundColor: !isButtonDisabled ? "#219142" : "#7c7c7c",
                    color: !isButtonDisabled ? "#fff" : "#444",
                  }}
                >
                  Agregar
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

export default AgregarProducto;
