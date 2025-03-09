import React, { useState } from "react";

const Content = () => {
  const [prompt, setPrompt] = useState("");
  const [templateId, setTemplateId] = useState(1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const data = {
      prompt,
      template_id: templateId,
    };

    try {
      const response = await fetch("https://127.0.0.1:8000/ppts/generate-ppt/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQxNDk4MzI3LCJpYXQiOjE3NDE0OTQ3MjcsImp0aSI6IjliZmNmNDE0NmRkZDRiZWU5YTAxOTNjNjEwYzNlYzk4IiwidXNlcl9pZCI6M30.oB8a1Yn3W9b25umVEkAixcrrOJquMTsaCl9kzwvAsQk`
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Error en la solicitud");
      }

      // Convertir la respuesta en un blob (archivo binario)
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      // Crear un enlace de descarga y hacer clic en él
      const a = document.createElement("a");
      a.href = url;
      a.download = "presentacion.pptx"; // Nombre del archivo
      document.body.appendChild(a);
      a.click();

      // Limpiar memoria
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Escribe tu tema"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <select value={templateId} onChange={(e) => setTemplateId(Number(e.target.value))}>
        <option value={1}>Plantilla 1</option>
        <option value={2}>Plantilla 2</option>
        <option value={3}>Plantilla 3</option>
      </select>
      <button type="submit">Generar PPT</button>
    </form>
  );
};

export default Content;
