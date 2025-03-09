import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ userData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Limpiar los datos del usuario
    localStorage.removeItem("userName");
    // Redirigir al login
    navigate("/");
  };

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <button className="sidebar-toggle" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "◄" : "►"}
      </button>
      
      <div className="sidebar-content">
        {/* Sección de perfil del usuario */}
        <div className="user-profile">
          <div className="profile-icon">
            {userData ? (
              <img
                src={userData.picture} // Foto de perfil del usuario
                alt="Foto de perfil"
                className="profile-picture"
              />
            ) : (
              "U" // Inicial del nombre si no hay foto
            )}
          </div>
          <div className="profile-info">
            <div className="profile-name">
              {userData ? userData.name : "Usuario"} {/* Nombre completo */}
            </div>
            <div className="profile-email">
              {userData ? userData.email : "free"} {/* Correo electrónico */}
            </div>
          </div>
        </div>

        {/* Botón de cerrar sesión */}
        <button onClick={handleLogout} className="logout-button">
          Cerrar sesión
        </button>
      </div>
    </div>
  );
};

export default Sidebar;