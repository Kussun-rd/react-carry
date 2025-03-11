import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./MisPlantillas.css"; // Archivo de estilos

const MisPlantillas = () => {
  const [presentaciones, setPresentaciones] = useState([]);
  const accessToken = localStorage.getItem("accessToken");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPresentaciones = async () => {
      try {
        const response = await fetch("https://127.0.0.1:8000/ppts/download/", {
          headers: { "Authorization": `Bearer ${accessToken}` }
        });
        const data = await response.json();
        setPresentaciones(data.presentaciones);
      } catch (error) {
        console.error("Error al cargar las presentaciones", error);
      }
    };

    if (accessToken) fetchPresentaciones();
  }, [accessToken]);

  const handleDownload = (id) => {
    window.location.href = `https://127.0.0.1:8000/ppts/download/${id}/`;
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`https://127.0.0.1:8000/ppts/delete/${id}/`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${accessToken}` }
      });
      setPresentaciones(presentaciones.filter(ppt => ppt.id !== id));
    } catch (error) {
      console.error("Error al eliminar la presentación", error);
    }
  };

  return (
    <div className="mis-plantillas-container">
      <h2>Mis Plantillas</h2>
      <ul className="plantillas-list">
        {presentaciones.map(ppt => (
          <li key={ppt.id} className="plantilla-item">
            <span className="plantilla-text">{ppt.prompt} - {ppt.fecha_creacion}</span>
            <div className="botones">
              <button className="descargar-btn" onClick={() => handleDownload(ppt.id)}>Descargar</button>
              <button className="eliminar-btn" onClick={() => handleDelete(ppt.id)}>Eliminar</button>
            </div>
          </li>
        ))}
      </ul>
      <button className="crear-nueva-btn" onClick={() => navigate("/plantilla")}>
        Crear Nueva Plantilla
      </button>
    </div>
  );
};

export default MisPlantillas;
