import {
  Button,
  Input,
  Label,
  makeStyles,
  useId,
} from "@fluentui/react-components";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    width: "100%",
    maxWidth: "400px",
    "> div": { display: "flex", flexDirection: "column", gap: "2px" },
  },
});

const Login = () => {
  const styles = useStyles();
  const navigate = useNavigate();
  const emailId = useId("input-email");
  const passwordId = useId("input-password");
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5134/api/Auth/login",
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
      console.error("Error al iniciar sesión:", error);
      alert("Credenciales inválidas");
    }
  };

  return (
    <div id="loginPrincipal" style={{ display: "flex" }}>
      <div
        id="izquierda"
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h2 id="logo">Sistema de inventario</h2>
      </div>

      <div id="derecha" style={{ flex: 1 }}>
        <form
          id="formulario"
          autoComplete="off"
          className={styles.root}
          onSubmit={handleSubmit}
        >
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
