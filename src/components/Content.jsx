import React, { useState, useEffect } from "react"; 
import "./Content.css";

const Content = () => {
  const [prompt, setPrompt] = useState("");
  const [templateId, setTemplateId] = useState(1);
  const [numSlides, setNumSlides] = useState(1);
  const [accessToken, setAccessToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [templatePreview, setTemplatePreview] = useState("/images/plantillas/template1.png");

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setAccessToken(token);
    }
  }, []);

  const handleTemplateChange = (e) => {
    const selectedTemplate = Number(e.target.value);
    setTemplateId(selectedTemplate);
    setTemplatePreview(`/images/plantillas/template${selectedTemplate}.png?t=${new Date().getTime()}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!accessToken) {
      alert("Debes iniciar sesión para generar una PPT.");
      return;
    }

    setLoading(true);
    setSuccessMessage("");

    const data = {
      prompt,
      template_id: templateId,
      num_slides: numSlides
    };

    try {
      const response = await fetch("https://127.0.0.1:8000/ppts/generate-ppt/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Error en la solicitud");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "presentacion.pptx";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);

      setSuccessMessage("✅ Diapositiva generada correctamente!");
    } catch (error) {
      console.error("Error:", error);
      setSuccessMessage("❌ Hubo un error al generar la diapositiva.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="content-container">
      <form className="content-form" onSubmit={handleSubmit}>
        {/* Reemplazamos el input de texto por un textarea con el mismo estilo anterior */}
        <textarea
          placeholder="Escribe tu tema"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="content-textarea styled-input"
          rows="3"
        ></textarea>

        <select 
          value={templateId} 
          onChange={handleTemplateChange}
          className="content-select"
        >
          {[...Array(8)].map((_, index) => (
            <option key={index + 1} value={index + 1}>Plantilla {index + 1}</option>
          ))}
        </select>

        <input 
          type="number" 
          min="1" 
          max="40" 
          value={numSlides} 
          onChange={(e) => setNumSlides(Number(e.target.value))}
          className="content-number"
        />

        <button type="submit" className="content-button">Generar PPT</button>
      </form>

      {/* Caja de vista previa de la plantilla */}
      <div className="template-preview-box">
        <img 
          src={templatePreview} 
          alt="Plantilla seleccionada"
          className="template-preview"
        />
      </div>

      {/* Mensajes de carga y éxito debajo de la vista previa */}
      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Generando presentación...</p>
        </div>
      )}

      {successMessage && (
        <div className="success-message">
          <p>{successMessage}</p>
        </div>
      )}
    </div>
  );
};

export default Content;
