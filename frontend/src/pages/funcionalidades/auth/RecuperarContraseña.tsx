import { Label, Input, Button } from "@fluentui/react-components";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const RecuperarContraseña = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        //"http://192.168.18.64/:5134/login",
        "https://inventarioapp-backend-hzahh2g8axd5c9b0.canadacentral-01.azurewebsites.net/api/Auth/request-password-reset",
        {
          email,
        }
      );

      if (response.status === 200) {
        setSuccess(true);
        // navigate("/principal");
      }
    } catch (error) {
      setError(true);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "black",
        color: "white",
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: "20%",
          height: "20vh",
          textAlign: "center",
        }}
      >
        <h2>Recuperar Contraseña</h2>
        <div>
          <Label htmlFor="email" style={{ color: "white" }}>
            Ingresa tu correo electrónico
          </Label>

          <Input
            type="text"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tuemail@ejemplo.com"
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              marginTop: "15px",
            }}
          />
          {error && (
            <span style={{ color: "red", marginBottom: "10px" }}>
              Por favor, ingresa un correo válido.
            </span>
          )}
          {success && (
            <span style={{ color: "green", marginBottom: "10px" }}>
              Se ha enviado un correo de recuperación.
            </span>
          )}
        </div>
        <Button
          appearance="primary"
          type="submit"
          style={{
            marginTop: "20px",
            backgroundColor: "#2052be",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "4px",
            cursor: "pointer",
            width: "100%",
          }}
        >
          Enviar correo
        </Button>
      </form>
    </div>
  );
};

export default RecuperarContraseña;
