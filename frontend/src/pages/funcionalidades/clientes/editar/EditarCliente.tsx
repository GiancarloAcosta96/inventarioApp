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
import ClientesServices from "../../../services/clientes/ClientesServices";
import { IEditarCliente } from "../../../interfaces/IClientes";

const EditarCliente: React.FC<IEditar> = ({ isOpen, isClose, reload, id }) => {
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
  const [dataEditarCliente, setDataEditarCliente] = useState<IEditarCliente>({
    clienteId: "",
    razonSocial: "",
    ruc: "",
    direccion: "",
  });

  function detalleProducto() {
    ClientesServices.obtenerClienteById(id).then((res) => {
      if (res.status == 200) {
        const aux = res.data;
        setDataEditarCliente({
          ...dataEditarCliente,
          clienteId: aux.clienteId,
          razonSocial: aux.razonSocial,
          ruc: aux.ruc,
          direccion: aux.direccion,
        });
      } else {
        setDataEditarCliente({
          clienteId: "",
          razonSocial: "",
          ruc: "",
          direccion: "",
        });
      }
    });
  }

  const infoEditar = () => {
    if (dataEditarCliente) {
      if (
        validarInfo == null ||
        validarInfo == undefined ||
        validarInfo.razonSocial == "" ||
        validarInfo.ruc == "" ||
        validarInfo.direccion == 0 ||
        validarInfo.cantidadStock == 0
      ) {
        setValidarInfo(dataEditarCliente);
      }
    }
  };

  const validarForm = () => {
    if (dataEditarCliente && validarInfo) {
      const camposIguales =
        dataEditarCliente.razonSocial === validarInfo.razonSocial &&
        dataEditarCliente.ruc === validarInfo.ruc &&
        dataEditarCliente.direccion === validarInfo.direccion;
      setIsButtonDisabled(camposIguales);
    }
  };

  function editarCliente() {
    setMostrarSpinner(true);
    setMostrarCuerpo(true);
    ClientesServices.editarCliente(dataEditarCliente)
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
    setDataEditarCliente({
      clienteId: "",
      razonSocial: "",
      ruc: "",
      direccion: "",
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
      case "razonSocial":
        setDataEditarCliente((prevData) => ({
          ...prevData,
          razonSocial: value,
        }));
        break;

      case "ruc":
        setDataEditarCliente((prevData) => ({
          ...prevData,
          ruc: value,
        }));
        break;

      case "direccion":
        setDataEditarCliente((prevData) => ({
          ...prevData,
          direccion: value,
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
  }, [validarInfo, dataEditarCliente]);

  useEffect(() => {
    infoEditar();
  }, [dataEditarCliente, validarInfo]);

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
              <DialogTitle>Editar Cliente</DialogTitle>
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
                      value={dataEditarCliente?.ruc ?? ""}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div style={{ width: "49%" }}>
                    <Label>Razón Social</Label>
                    <Input
                      name="razonSocial"
                      style={{ display: "flex", flexDirection: "column" }}
                      value={dataEditarCliente?.razonSocial ?? ""}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <br />
                <Label>Dirección</Label>
                <Input
                  name="direccion"
                  style={{ display: "flex", flexDirection: "column" }}
                  value={dataEditarCliente?.direccion ?? ""}
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
                  onClick={editarCliente}
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

export default EditarCliente;
