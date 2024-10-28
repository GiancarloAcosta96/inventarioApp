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
  Combobox,
  Option,
} from "@fluentui/react-components";
import React, { useEffect, useState } from "react";
import {
  CheckmarkCircleRegular,
  ErrorCircleRegular,
} from "@fluentui/react-icons";
import { IAgregarUsuario, IRolCombo } from "../../../interfaces/IUsuarios";
import RolesServices from "../../../services/roles/RolesServices";
import UsuariosServices from "../../../services/usuarios/UsuariosServices";
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
  const [dataRol, setDataRol] = useState<IRolCombo[]>(null!);
  const [searchText, setSearchText] = useState<string>("");
  const [dataAgregarUsuario, setDataAgregarUsuario] = useState<IAgregarUsuario>(
    {
      nombre: "",
      apellido: "",
      nombreUsuario: "",
      email: "",
      password: "",
      rolId: "",
    }
  );
  const [passwordError, setPasswordError] = useState<string>("");
  const validarPassword = (password: string): boolean => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return passwordRegex.test(password);
  };

  function registarProducto() {
    setMostrarSpinner(true);
    setMostrarCuerpo(true);

    UsuariosServices.agregarUsuario(dataAgregarUsuario)
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

  const limpiar = () => {
    setDataAgregarUsuario({
      nombre: "",
      apellido: "",
      nombreUsuario: "",
      email: "",
      password: "",
      rolId: "",
    });
    setPasswordError("");
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
        setDataAgregarUsuario((prevData) => ({
          ...prevData,
          nombre: value,
        }));
        break;

      case "apellido":
        setDataAgregarUsuario((prevData) => ({
          ...prevData,
          apellido: value,
        }));
        break;

      case "nombreUsuario":
        setDataAgregarUsuario((prevData) => ({
          ...prevData,
          nombreUsuario: value,
        }));
        break;

      case "email":
        setDataAgregarUsuario((prevData) => ({
          ...prevData,
          email: value,
        }));
        break;

      case "password":
        setDataAgregarUsuario((prevData) => ({
          ...prevData,
          password: value,
        }));
        setPasswordError(
          validarPassword(value)
            ? ""
            : "La contraseña debe tener al menos 8 caracteres, incluyendo una mayúscula, una minúscula, un número y un carácter especial."
        );
        break;

      default:
        break;
    }
  };

  const filteredOptions = dataRol?.filter((option) =>
    option.text.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  const handleRol = (event: any, option: any) => {
    setDataAgregarUsuario({
      ...dataAgregarUsuario,
      rolId: option.optionValue,
    });
  };

  useEffect(() => {
    const isFormComplete =
      dataAgregarUsuario.nombreUsuario.trim() !== "" &&
      dataAgregarUsuario.email.trim() !== "" &&
      dataAgregarUsuario.password !== "" &&
      dataAgregarUsuario.nombre !== "" &&
      dataAgregarUsuario.apellido !== "" &&
      dataAgregarUsuario.rolId !== "" &&
      !passwordError;
    setIsButtonDisabled(!isFormComplete);
  }, [dataAgregarUsuario]);

  useEffect(() => {
    obtenerRol();
  }, []);

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
              <DialogTitle>Agregar Nuevo Usuario</DialogTitle>
              {/* <pre>{JSON.stringify(dataAgregarUsuario, null, 2)}</pre> */}
              <DialogContent>
                <br />
                <Label>Nombres</Label>
                <Input
                  name="nombre"
                  style={{ display: "flex", flexDirection: "column" }}
                  value={dataAgregarUsuario?.nombre ?? ""}
                  onChange={handleInputChange}
                />
                <br />
                <Label>Apellidos</Label>
                <Input
                  name="apellido"
                  style={{ display: "flex", flexDirection: "column" }}
                  value={dataAgregarUsuario?.apellido ?? ""}
                  onChange={handleInputChange}
                />
                <br />
                <Label>Nombre de usuario</Label>
                <Input
                  name="nombreUsuario"
                  style={{ display: "flex", flexDirection: "column" }}
                  value={dataAgregarUsuario?.nombreUsuario ?? ""}
                  onChange={handleInputChange}
                />
                <br />

                <Label>Email</Label>
                <Input
                  name="email"
                  style={{ display: "flex", flexDirection: "column" }}
                  value={dataAgregarUsuario?.email ?? ""}
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
                    <Label>Contraseña</Label>
                    <Input
                      type="password"
                      name="password"
                      style={{ display: "flex", flexDirection: "column" }}
                      value={dataAgregarUsuario?.password ?? ""}
                      onChange={handleInputChange}
                    />
                    {passwordError && (
                      <div style={{ color: "red", fontSize: "12px" }}>
                        {passwordError}
                      </div>
                    )}
                  </div>

                  <div style={{ width: "49%" }}>
                    <Label>Rol</Label>
                    <Combobox
                      onChange={handleSearchChange}
                      style={{ width: "100%" }}
                      placeholder="Selecciona el rol"
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
