import { Outlet } from "react-router-dom";
import React from "react";
import TopBar from "../../../components/TopBar";

const ProtectedLayout = () => {
  return (
    <div className="app">
      <TopBar />

      <div
        style={{
          width: "100%",
          height: "100vh",
          display: "flex",
        }}
        className="content"
      >
        <Outlet />
      </div>
    </div>
  );
};

export default ProtectedLayout;
