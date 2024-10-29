import {
  Button,
  Input,
  Label,
  makeStyles,
  Image,
  useId,
} from "@fluentui/react-components";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import inventarioImage from "../../../assets/inventario.jpg";

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    width: "100%",
    maxWidth: "400px",
    "> div": { display: "flex", flexDirection: "column", gap: "2px" },
  },
  errorMessage: {
    color: "red",
    fontSize: "14px",
    marginTop: "5px",
  },
  imageContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "60%",
    height: "100%",
  },
  image: {
    width: "100%",
    maxHeight: "100%",
    objectFit: "contain",
  },
  hiddenOnMobile: {
    display: "none",
  },
});

const Login = () => {
  const styles = useStyles();
  const navigate = useNavigate();
  const emailId = useId("input-email");
  const passwordId = useId("input-password");
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);
    try {
      const response = await axios.post(
        //"http://192.168.18.64/:5134/login",
        "https://inventarioapp-backend-hzahh2g8axd5c9b0.canadacentral-01.azurewebsites.net/api/Auth/login",
        {
          nombreUsuario,
          password,
        }
      );

      if (response.status === 200) {
        localStorage.removeItem("token");
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("nombre", response.data.nombre);
        localStorage.setItem("rol", response.data.rol);
        localStorage.setItem("accesoTotal", response.data.accesoTotal);
        localStorage.setItem("usuarioId", response.data.usuarioId);
        navigate("/principal");
      }
    } catch (error) {
      setError(true);
    }
  };

  return (
    <div id="loginPrincipal" style={{ display: "flex" }}>
      <div id="izquierda" className={styles.imageContainer}>
        <h2 id="logo" className={styles.hiddenOnMobile}>
          <Image
            alt="Allan's avatar"
            src={inventarioImage}
            className={styles.image}
          />
        </h2>
      </div>

      <div id="derecha" style={{ flex: 1 }}>
        <form
          id="formulario"
          autoComplete="off"
          className={styles.root}
          onSubmit={handleSubmit}
        >
          <h2 id="tituloSistema">Sistema de Inventario inteligente (SGII)</h2>
          <div>
            <Label id="usuario">Ingresa tu usuario</Label>
            <Input
              size="large"
              type="text"
              id={emailId}
              value={nombreUsuario}
              onChange={(e) => setNombreUsuario(e.target.value)}
            />
          </div>
          <div>
            <Label id="password">Ingresa tu contraseña</Label>
            <Input
              size="large"
              type="password"
              id={passwordId}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && (
              <span className={styles.errorMessage}>
                Credenciales inválidas
              </span>
            )}
          </div>
          <Button
            appearance="primary"
            type="submit"
            style={{
              height: "40px",
              backgroundColor: "#2052be",
              border: "none",
            }}
          >
            Ingresar
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
