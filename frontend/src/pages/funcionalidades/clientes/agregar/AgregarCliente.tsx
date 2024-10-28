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
import { IAgregarCliente } from "../../../interfaces/IClientes";
import ClientesServices from "../../../services/clientes/ClientesServices";
import { IAgregar } from "../../../../components/InterfaceProps";

const AgregarCliente: React.FC<IAgregar> = ({ isOpen, isClose, reload }) => {
  const [respuesta, setRespuesta] = useState({
    message: "",
    success: false,
    title: "",
  });
  const [mostrarCuerpo, setMostrarCuerpo] = useState(false);
  const [mostrarMensaje, setMostrarMensaje] = useState(false);
  const [mostrarSpinner, setMostrarSpinner] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [dataAgregarCliente, setDataAgregarCliente] = useState<IAgregarCliente>(
    {
      ruc: "",
      razonSocial: "",
      direccion: "",
    }
  );

  function registarProducto() {
    setMostrarSpinner(true);
    setMostrarCuerpo(true);
    ClientesServices.agregarCliente(dataAgregarCliente)
      .then((res) => {
        if (res.data) {
          console.log(respuesta);
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
    setDataAgregarCliente({
      ruc: "",
      razonSocial: "",
      direccion: "",
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
      case "ruc":
        setDataAgregarCliente((prevData) => ({
          ...prevData,
          ruc: value,
        }));
        break;

      case "razonSocial":
        setDataAgregarCliente((prevData) => ({
          ...prevData,
          razonSocial: value,
        }));
        break;

      case "direccion":
        setDataAgregarCliente((prevData) => ({
          ...prevData,
          direccion: value,
        }));
        break;

      default:
        break;
    }
  };

  useEffect(() => {
    const isFormComplete =
      dataAgregarCliente.ruc.trim().length === 11 &&
      dataAgregarCliente.razonSocial.trim() !== "" &&
      dataAgregarCliente.direccion.trim() !== "";
    setIsButtonDisabled(!isFormComplete);
  }, [dataAgregarCliente]);

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
              <DialogTitle>Agregar Nuevo Cliente</DialogTitle>
              <DialogContent>
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ width: "49%" }}>
                    <Label>RUC</Label>
                    <Input
                      name="ruc"
                      style={{ display: "flex", flexDirection: "column" }}
                      value={dataAgregarCliente?.ruc ?? ""}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div style={{ width: "49%" }}>
                    <Label>Razón Social</Label>
                    <Input
                      name="razonSocial"
                      style={{ display: "flex", flexDirection: "column" }}
                      value={dataAgregarCliente?.razonSocial ?? ""}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <br />
                <Label>Dirección</Label>
                <Input
                  name="direccion"
                  style={{ display: "flex", flexDirection: "column" }}
                  value={dataAgregarCliente?.direccion ?? ""}
                  onChange={handleInputChange}
                />
                <br />

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

export default AgregarCliente;
