import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FolderOpen } from "lucide-react";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(
    localStorage.getItem("sidebarOpen") === "true"
  );
  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("userData")) || null
  );

  useEffect(() => {
    if (location.pathname === "/mis-plantillas") {
      setIsOpen(false);
      localStorage.setItem("sidebarOpen", "false");
    }
  }, [location.pathname]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userData"));
    if (storedUser) {
      setUserData(storedUser);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userData");
    localStorage.removeItem("accessToken");
    setUserData(null);
    navigate("/");
  };

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      {location.pathname !== "/MisPlantillas" && (
        <button className="sidebar-toggle" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? "◄" : "►"}
        </button>
      )}

      <div className="sidebar-content">
        <div className="user-profile">
          <div className="profile-icon">
            {userData && userData.picture ? (
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

        <button className="sidebar-btn" onClick={() => navigate("/MisPlantillas")}>
          <FolderOpen size={20} /> Mis Plantillas
        </button>

        <button onClick={handleLogout} className="logout-button">
          Cerrar sesión
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
