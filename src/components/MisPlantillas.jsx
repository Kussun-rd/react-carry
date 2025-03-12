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
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const data = await response.json();

        if (!Array.isArray(data.presentaciones)) {
          throw new Error("La respuesta del servidor no es un array.");
        }

        setPresentaciones(data.presentaciones);
      } catch (error) {
        console.error("Error al cargar las presentaciones", error);
      }
    };

    if (accessToken) fetchPresentaciones();
  }, [accessToken]);

  const handleDownload = async (id) => {
    try {
      const response = await fetch(`https://127.0.0.1:8000/ppts/download/${id}/`, {
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!response.ok) {
        throw new Error("Error al descargar la presentación");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `presentacion_${id}.pptx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al descargar:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`https://127.0.0.1:8000/ppts/delete/${id}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setPresentaciones(presentaciones.filter((ppt) => ppt.id !== id));
    } catch (error) {
      console.error("Error al eliminar la presentación", error);
    }
  };

  // 🔹 Función para agrupar por día
  const agruparPorDia = () => {
    const presentacionesPorDia = {};

    presentaciones.forEach((ppt) => {
      if (!ppt.fecha_creacion) return; // Evita errores si la fecha es nula

      const fecha = new Date(ppt.fecha_creacion).toISOString().split("T")[0]; // Formato YYYY-MM-DD

      if (!presentacionesPorDia[fecha]) {
        presentacionesPorDia[fecha] = [];
      }

      presentacionesPorDia[fecha].push(ppt);
    });

    return presentacionesPorDia;
  };

  const presentacionesPorDia = agruparPorDia();

  return (
    <div className="mis-plantillas-container">
      <h2>Mis Diapositivas</h2>

      {/* 🔹 Secciones por día */}
      {Object.keys(presentacionesPorDia).length > 0 ? (
        Object.keys(presentacionesPorDia).map((fecha) => (
          <div key={fecha} className="agrupacion-dia">
            <h3>{fecha}</h3>
            <ul className="plantillas-list">
              {presentacionesPorDia[fecha].map((ppt) => (
                <li key={ppt.id} className="plantilla-item">
                  <span className="plantilla-text">
                    {ppt.prompt} - {ppt.fecha_creacion}
                  </span>
                  <div className="botones">
                    <button className="descargar-btn" onClick={() => handleDownload(ppt.id)}>
                      Descargar
                    </button>
                    <button className="eliminar-btn" onClick={() => handleDelete(ppt.id)}>
                      Eliminar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <p>No hay presentaciones disponibles.</p>
      )}

      <button className="crear-nueva-btn" onClick={() => navigate("/plantilla")}>
        Crear Nueva Plantilla
      </button>
    </div>
  );
};

export default MisPlantillas;
