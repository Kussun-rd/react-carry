import React from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Content from "./Content";
import Footer from "./Footer";
import "../App.css";

const Plantilla = () => {
  const location = useLocation();
  const userData = location.state?.userData; // Obtén los datos del usuario

  return (
    <div className="app-container">
      <Sidebar userData={userData} /> {/* Pasa los datos al Sidebar */}
      <div className="main-content">
        <Header />
        <Content />
        <Footer />
      </div>
    </div>
  );
};

export default Plantilla;