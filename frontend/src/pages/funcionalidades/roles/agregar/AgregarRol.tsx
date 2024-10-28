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
  Spinner,
  Checkbox,
} from "@fluentui/react-components";
import React, { useEffect, useState } from "react";
import {
  CheckmarkCircleRegular,
  ErrorCircleRegular,
} from "@fluentui/react-icons";
import { IAgregarRol } from "../../../interfaces/IRoles";
import RolesServices from "../../../services/roles/RolesServices";
import { IAgregar } from "../../../../components/InterfaceProps";

const AgregarRol: React.FC<IAgregar> = ({ isOpen, isClose, reload }) => {
  const [respuesta, setRespuesta] = useState({
    message: "",
    success: false,
    title: "",
  });
  const [mostrarCuerpo, setMostrarCuerpo] = useState(false);
  const [mostrarMensaje, setMostrarMensaje] = useState(false);
  const [mostrarSpinner, setMostrarSpinner] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [dataAgregarRol, setDataAgregarRol] = useState<IAgregarRol>({
    nombreRol: "",
    accesoTotal: 0,
  });

  function registrarRol() {
    setMostrarSpinner(true);
    setMostrarCuerpo(true);
    RolesServices.agregarRol(dataAgregarRol)
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
    setDataAgregarRol({
      nombreRol: "",
      accesoTotal: 0,
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
      case "nombreRol":
        setDataAgregarRol((prevData) => ({
          ...prevData,
          nombreRol: value,
        }));
        break;

      default:
        break;
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDataAgregarRol((prevData) => ({
      ...prevData,
      accesoTotal: e.target.checked ? 1 : 0,
    }));
  };

  useEffect(() => {
    const isFormComplete =
      dataAgregarRol.nombreRol.trim() !== "" &&
      !isNaN(dataAgregarRol.accesoTotal);
    setIsButtonDisabled(!isFormComplete);
  }, [dataAgregarRol]);

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
              {/* <pre>{JSON.stringify(dataAgregarRol, null, 2)}</pre> */}
              <DialogTitle>Agregar Nuevo Rol</DialogTitle>
              <DialogContent>
                <br />
                <Label>Nombre</Label>
                <Input
                  name="nombreRol"
                  style={{ display: "flex", flexDirection: "column" }}
                  value={dataAgregarRol?.nombreRol ?? ""}
                  onChange={handleInputChange}
                />
                <br />

                <Checkbox
                  label="Acceso Total"
                  checked={dataAgregarRol.accesoTotal === 1}
                  onChange={handleCheckboxChange}
                />
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
                  onClick={registrarRol}
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

export default AgregarRol;
