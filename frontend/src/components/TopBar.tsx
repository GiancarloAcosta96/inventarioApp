import {
  Menu,
  MenuTrigger,
  MenuButton,
  MenuPopover,
  MenuList,
  MenuItem,
} from "@fluentui/react-components";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const TopBar = () => {
  const navigate = useNavigate();
  const nombre = localStorage.getItem("nombre");
  const cargo = localStorage.getItem("rol");
  const token = localStorage.getItem("token");
  const [currentTime, setCurrentTime] = useState<string>("");

  const handleLogout = () => {
    fetch("http://localhost:5134/api/Auth/logout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        localStorage.clear();
        navigate("/login");
      })
      .catch((error) => console.error("Error al cerrar sesión:", error));
  };

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const formattedTime = now.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      setCurrentTime(formattedTime);
    };

    const intervalId = setInterval(updateClock, 1000);
    updateClock();

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="topbar">
      <h1 className="tituloTop">SGII</h1>
      <div style={{ display: "flex", gap: "20px" }}>
        <h3>Perú / Ecuador</h3>
        <h3 style={{ fontSize: "20px" }}>{currentTime}</h3>
      </div>
      <div className="user-info">
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span className="nombre-usuario">{nombre}</span>
          <span className="rol">{cargo}</span>
        </div>
        <Menu>
          <MenuTrigger>
            <MenuButton className="logout-button" />
          </MenuTrigger>
          <MenuPopover>
            <MenuList>
              <MenuItem onClick={handleLogout}>Cerrar sesión</MenuItem>
            </MenuList>
          </MenuPopover>
        </Menu>
      </div>
    </div>
  );
};

export default TopBar;
