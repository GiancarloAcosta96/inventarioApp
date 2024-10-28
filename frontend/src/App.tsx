import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import "./App.css";
import {
  FluentProvider,
  webDarkTheme,
  webLightTheme,
} from "@fluentui/react-components";
import AuthLayout from "./pages/funcionalidades/auth/AuthLayout";
import Login from "./pages/funcionalidades/auth/Login";
import ProtectedRoute from "./pages/funcionalidades/auth/ProtectedRoute";
import ProtectedLayout from "./pages/funcionalidades/auth/ProtectedLayout";
import PaginaPrincipal from "./pages/funcionalidades/principal/PaginaPrincipal";
import ListarPedidos from "./pages/funcionalidades/pedidos/mostrar/TablaPedidos";
import TablaPedidos from "./pages/funcionalidades/pedidos/mostrar/TablaPedidos";
import TablaProductos from "./pages/funcionalidades/productos/mostrar/TablaProductos";
import TablaClientes from "./pages/funcionalidades/clientes/mostrar/TablaClientes";
import TablaUsuarios from "./pages/funcionalidades/usuarios/mostrar/TablaUsuarios";
import TablaRoles from "./pages/funcionalidades/roles/mostrar/TablaRoles";

function App() {
  return (
    <FluentProvider theme={webDarkTheme}>
      <Router>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route element={<ProtectedLayout />}>
              <Route path="/principal" element={<PaginaPrincipal />} />
              <Route path="/pedidos" element={<TablaPedidos />} />
              <Route path="/productos" element={<TablaProductos />} />
              <Route path="/clientes" element={<TablaClientes />} />
              <Route path="/usuarios" element={<TablaUsuarios />} />
              <Route path="/roles" element={<TablaRoles />} />
              <Route path="/" element={<Navigate to="/principal" />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </FluentProvider>
  );
}

export default App;
