import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FolderOpen } from "lucide-react";

const Sidebar = ({ userData }) => {
  const navigate = useNavigate();
  const location = useLocation(); // Detectar la URL actual
  const [isOpen, setIsOpen] = useState(
    localStorage.getItem("sidebarOpen") === "true"
  );

  useEffect(() => {
    if (location.pathname === "/mis-plantillas") {
      setIsOpen(false);
      localStorage.setItem("sidebarOpen", "false");
    }
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("userName");
    navigate("/");
  };

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      {/* Ocultar la flecha si está en /mis-plantillas */}
      {location.pathname !== "/MisPlantillas" && (
        <button className="sidebar-toggle" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? "◄" : "►"}
        </button>
      )}

      <div className="sidebar-content">
        <div className="user-profile">
          <div className="profile-icon">
            {userData ? (
              <img
                src={userData.picture}
                alt="Foto de perfil"
                className="profile-picture"
              />
            ) : (
              <div className="profile-placeholder">U</div>
            )}
          </div>
          <div className="profile-info">
            <div className="profile-name">{userData ? userData.name : "Usuario"}</div>
            <div className="profile-email">{userData ? userData.email : "free"}</div>
          </div>
        </div>

        {/* Botón de Mis Plantillas */}
        <button className="sidebar-btn" onClick={() => navigate("/MisPlantillas")}>
          <FolderOpen size={20} /> Mis Plantillas
        </button>

        {/* Botón de Cerrar sesión */}
        <button onClick={handleLogout} className="logout-button">
          Cerrar sesión
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
