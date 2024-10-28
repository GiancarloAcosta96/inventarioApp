import { Card } from "@fluentui/react-components";
import {
  BoxRegular,
  PeopleTeamToolboxRegular,
  PersonBoardRegular,
  SlideTextPersonRegular,
  VehicleTruckProfileRegular,
} from "@fluentui/react-icons";
import { Link } from "react-router-dom";
import ProductosServices from "../../services/productos/ProductosServices";
import { useEffect, useState } from "react";
import { IDataInventario } from "../../interfaces/IProductos";

const PaginaPrincipal = () => {
  const [dataInventario, setDataInventario] = useState<IDataInventario>({
    totalProducto: 0,
    totalInventario: 0,
    promedioInventario: 0,
    cantidadPedidosPendientes: 0,
    cantidadPedidosAprobados: 0,
  });

  function obtenerDatos() {
    ProductosServices.obtenerInventario().then((res) => {
      if (res.status == 200) {
        setDataInventario(res.data);
      }
    });
  }

  useEffect(() => {
    obtenerDatos();
  }, []);

  return (
    <div className="grid-container">
      <Card className="grid-item">
        <div>
          <h3>Estadísticas</h3>
          <div className="stats-grid">
            <span className="stat-label">Pedidos Aprobados:</span>
            <span className="stat-value">
              {dataInventario?.cantidadPedidosAprobados}
            </span>

            <span className="stat-label">Pedidos Pendientes:</span>
            <span className="stat-value">
              {dataInventario?.cantidadPedidosPendientes}
            </span>

            <span className="stat-label">Total de productos:</span>
            <span className="stat-value">{dataInventario?.totalProducto}</span>

            <span className="stat-label">Inventario Total:</span>
            <span className="stat-value">
              S/ {dataInventario?.totalInventario}
            </span>

            <span className="stat-label">Promedio de productos:</span>
            <span className="stat-value">
              S/ {dataInventario?.promedioInventario}
            </span>
          </div>
        </div>
      </Card>

      <Link className="grid-item" to="/pedidos">
        <Card className="grid-card">
          <VehicleTruckProfileRegular
            style={{
              fontSize: "100px",
              display: "flex",
              margin: "auto",
            }}
          />
          <h2>Pedidos</h2>
        </Card>
      </Link>

      <Link className="grid-item" to="/productos">
        <Card className="grid-card">
          <BoxRegular
            style={{ fontSize: "100px", display: "flex", margin: "auto" }}
          />
          <h2>Productos</h2>
        </Card>
      </Link>

      <Link className="grid-item" to="/clientes">
        <Card className="grid-card">
          <PeopleTeamToolboxRegular
            style={{ fontSize: "100px", display: "flex", margin: "auto" }}
          />
          <h2>Clientes</h2>
        </Card>
      </Link>

      <Link className="grid-item" to="/usuarios">
        <Card className="grid-card">
          <PersonBoardRegular
            style={{ fontSize: "100px", display: "flex", margin: "auto" }}
          />
          <h2>Usuarios</h2>
        </Card>
      </Link>

      <Link className="grid-item" to="/roles">
        <Card className="grid-card">
          <SlideTextPersonRegular
            style={{ fontSize: "100px", display: "flex", margin: "auto" }}
          />
          <h2>Roles</h2>
        </Card>
      </Link>
    </div>
  );
};

export default PaginaPrincipal;
