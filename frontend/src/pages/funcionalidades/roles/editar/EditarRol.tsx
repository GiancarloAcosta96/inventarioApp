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
  Option,
  Spinner,
  Combobox,
  Checkbox,
} from "@fluentui/react-components";
import React, { useEffect, useState } from "react";
import {
  CheckmarkCircleRegular,
  ErrorCircleRegular,
} from "@fluentui/react-icons";
import { IEditar } from "../../../../components/InterfaceProps";
import { IEditarUsuario, IRolCombo } from "../../../interfaces/IUsuarios";
import RolesServices from "../../../services/roles/RolesServices";
import UsuariosServices from "../../../services/usuarios/UsuariosServices";
import { IEditarRol } from "../../../interfaces/IRoles";

const EditarRol: React.FC<IEditar> = ({ isOpen, isClose, reload, id }) => {
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
  const [dataEditarRol, setDataEditarRol] = useState<IEditarRol>({
    rolId: "",
    nombreRol: "",
    accesoTotal: 0,
  });

  function detalleRol() {
    RolesServices.detalleRol(id).then((res) => {
      if (res.status == 200) {
        const aux = res.data;
        setDataEditarRol({
          ...dataEditarRol,
          rolId: aux.rolId,
          nombreRol: aux.nombreRol,
          accesoTotal: aux.accesoTotal,
        });
      } else {
        setDataEditarRol({
          rolId: "",
          nombreRol: "",
          accesoTotal: 0,
        });
      }
    });
  }

  const infoEditar = () => {
    if (dataEditarRol) {
      if (
        validarInfo == null ||
        validarInfo == undefined ||
        validarInfo.nombreRol == "" ||
        validarInfo.accesoTotal == 2
      ) {
        setValidarInfo(dataEditarRol);
      }
    }
  };

  const validarForm = () => {
    if (dataEditarRol && validarInfo) {
      const camposIguales =
        dataEditarRol.nombreRol === validarInfo.nombreRol &&
        dataEditarRol.rolId === validarInfo.rolId &&
        dataEditarRol.accesoTotal == validarInfo.accesoTotal;
      setIsButtonDisabled(camposIguales);
    }
  };

  function editarRol() {
    setMostrarSpinner(true);
    setMostrarCuerpo(true);
    RolesServices.editarRol(dataEditarRol)
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
    setDataEditarRol({
      rolId: "",
      nombreRol: "",
      accesoTotal: 0,
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
      case "nombreRol":
        setDataEditarRol((prevData) => ({
          ...prevData,
          nombreRol: value,
        }));
        break;
      default:
        break;
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDataEditarRol((prevData) => ({
      ...prevData,
      accesoTotal: e.target.checked ? 1 : 0,
    }));
  };

  useEffect(() => {
    detalleRol();
  }, [id]);

  useEffect(() => {
    validarForm();
  }, [validarInfo, dataEditarRol]);

  useEffect(() => {
    infoEditar();
  }, [dataEditarRol, validarInfo]);

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
              <DialogTitle>Editar Rol</DialogTitle>
              <DialogContent>
                <br />
                <Label>Nombre</Label>
                <Input
                  name="nombreRol"
                  style={{ display: "flex", flexDirection: "column" }}
                  value={dataEditarRol?.nombreRol ?? ""}
                  onChange={handleInputChange}
                />
                <br />

                <Checkbox
                  label="Acceso Total"
                  checked={dataEditarRol.accesoTotal === 1}
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
                  onClick={editarRol}
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

export default EditarRol;
