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

const EditarUsuario: React.FC<IEditar> = ({ isOpen, isClose, reload, id }) => {
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
  const [searchText, setSearchText] = useState<string>("");
  const [dataRol, setDataRol] = useState<IRolCombo[]>(null!);
  const [dataEditarUsuario, setDataEditarUsuario] = useState<IEditarUsuario>({
    usuarioId: "",
    nombre: "",
    apellido: "",
    nombreUsuario: "",
    rolId: "",
    rol: "",
  });

  function detalleUsuario() {
    UsuariosServices.detalleUsuario(id).then((res) => {
      if (res.status == 200) {
        const aux = res.data;
        setDataEditarUsuario({
          ...dataEditarUsuario,
          usuarioId: aux.usuarioId,
          nombre: aux.nombre,
          apellido: aux.apellido,
          nombreUsuario: aux.nombreUsuario,
          rolId: aux.rolId,
          rol: aux.rol,
        });
      } else {
        setDataEditarUsuario({
          usuarioId: "",
          nombre: "",
          apellido: "",
          nombreUsuario: "",
          rolId: "",
          rol: "",
        });
      }
    });
  }

  function obtenerRol() {
    RolesServices.obtenerRolesCombo("").then((res) => {
      if (res.status === 200) {
        const dataCat = res.data.map((x: IRolCombo) => ({
          key: x.key,
          text: x.text,
        }));
        setDataRol(dataCat);
      }
    });
  }

  const infoEditar = () => {
    if (dataEditarUsuario) {
      if (
        validarInfo == null ||
        validarInfo == undefined ||
        validarInfo.nombreUsuario == "" ||
        validarInfo.nombre == "" ||
        validarInfo.apellido == "" ||
        validarInfo.rol == "" ||
        validarInfo.rolId == ""
      ) {
        setValidarInfo(dataEditarUsuario);
      }
    }
  };

  const validarForm = () => {
    if (dataEditarUsuario && validarInfo) {
      const camposIguales =
        dataEditarUsuario.nombreUsuario === validarInfo.nombreUsuario &&
        dataEditarUsuario.rolId === validarInfo.rolId &&
        dataEditarUsuario.nombre === validarInfo.nombre &&
        dataEditarUsuario.apellido === validarInfo.apellido;
      setIsButtonDisabled(camposIguales);
    }
  };

  function editarUsuario() {
    setMostrarSpinner(true);
    setMostrarCuerpo(true);
    UsuariosServices.editarUsuario(dataEditarUsuario)
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
    setDataEditarUsuario({
      usuarioId: "",
      nombre: "",
      apellido: "",
      nombreUsuario: "",
      rolId: "",
      rol: "",
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
      case "nombre":
        setDataEditarUsuario((prevData) => ({
          ...prevData,
          nombre: value,
        }));
        break;

      case "apellido":
        setDataEditarUsuario((prevData) => ({
          ...prevData,
          apellido: value,
        }));
        break;

      case "nombreUsuario":
        setDataEditarUsuario((prevData) => ({
          ...prevData,
          nombreUsuario: value,
        }));
        break;
      default:
        break;
    }
  };

  const handleRol = (event: any, option: any) => {
    setDataEditarUsuario({
      ...dataEditarUsuario,
      rolId: option.optionValue,
    });
  };

  const filteredOptions = dataRol?.filter((option) =>
    option.text.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  useEffect(() => {
    detalleUsuario();
  }, [id]);

  useEffect(() => {
    obtenerRol();
  }, []);

  useEffect(() => {
    validarForm();
  }, [validarInfo, dataEditarUsuario]);

  useEffect(() => {
    infoEditar();
  }, [dataEditarUsuario, validarInfo]);

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
              <DialogTitle>Editar Usuario</DialogTitle>
              {/* <pre>{JSON.stringify(dataEditarUsuario, null, 2)}</pre>
              <pre>{JSON.stringify(validarInfo, null, 2)}</pre> */}
              <DialogContent>
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ width: "49%" }}>
                    <Label>Nombres</Label>
                    <Input
                      name="nombre"
                      style={{ display: "flex", flexDirection: "column" }}
                      value={dataEditarUsuario?.nombre ?? ""}
                      onChange={handleInputChange}
                    />

                    <Label>Nombre de usuario</Label>
                    <Input
                      name="nombreUsuario"
                      style={{ display: "flex", flexDirection: "column" }}
                      value={dataEditarUsuario?.nombreUsuario ?? ""}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div style={{ width: "49%" }}>
                    <Label>Apellidos</Label>
                    <Input
                      name="apellido"
                      style={{ display: "flex", flexDirection: "column" }}
                      value={dataEditarUsuario?.apellido ?? ""}
                      onChange={handleInputChange}
                    />
                    <Label>Rol</Label>
                    <Combobox
                      onChange={handleSearchChange}
                      style={{ width: "100%" }}
                      placeholder={dataEditarUsuario?.rol}
                      onOptionSelect={handleRol}
                    >
                      {filteredOptions &&
                        filteredOptions.map((option) => (
                          <Option
                            key={option.key}
                            text={option.text}
                            value={option.key}
                          >
                            {option.text}
                          </Option>
                        ))}
                    </Combobox>
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
                  onClick={editarUsuario}
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

export default EditarUsuario;
