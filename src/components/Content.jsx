import React, { useState } from "react";

const Content = () => {
  const [prompt, setPrompt] = useState(""); // Estado para el input de texto
  const [selectedOption, setSelectedOption] = useState(""); // Estado para la lista desplegable

  // Opciones para la lista desplegable
  const options = [
    { value: "1", label: "Opción 1" },
    { value: "2", label: "Opción 2" },
    { value: "3", label: "Opción 3" },
  ];

  // Función para manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Prompt:", prompt);
    console.log("Opción seleccionada:", selectedOption);
    alert("Datos enviados correctamente");
  };

  return (
    <section className="content">
      {/* Título principal */}
      <h1 className="main-title">Presentaciones</h1>

      {/* Formulario para el prompt y la lista desplegable */}
      <form onSubmit={handleSubmit} className="prompt-form">
        <div className="input-container">
          {/* Input de texto para el prompt */}
          <input
            type="text"
            placeholder="Escribe tu prompt aquí..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="prompt-input"
          />

          {/* Lista desplegable */}
          <select
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
            className="prompt-select"
          >
            <option value="">Selecciona una opción</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Botón de enviar */}
        <button type="submit" className="submit-button">
          Enviar
        </button>
      </form>

      {/* Pie de página */}
      <footer className="footer">
        <p>© 2023 TecCreate. Todos los derechos reservados.</p>
      </footer>
    </section>
  );
};

export default Content;