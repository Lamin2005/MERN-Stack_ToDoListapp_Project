import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "../components/Navbar";

function Main() {
  return (
    <div className="container">
      <NavBar />
      <main className="content-area">
        <Outlet />
      </main>
    </div>
  );
}

export default Main;
