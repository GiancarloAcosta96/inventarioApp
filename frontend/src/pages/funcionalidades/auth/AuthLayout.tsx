import React from "react";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="auth-app">
      <Outlet />
    </div>
  );
};

export default AuthLayout;
