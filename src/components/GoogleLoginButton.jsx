import React, { useState, useEffect } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import axios from "axios";

const GoogleLoginButton = () => {
  const clientId = "64075915222-g6fb8obd0qmgpqtpqdol40m6g5o56o4i.apps.googleusercontent.com";
  const [userName, setUserName] = useState(localStorage.getItem("userName") || null);

  useEffect(() => {
    const storedUser = localStorage.getItem("userName");
    if (storedUser) {
      setUserName(storedUser);
    }
  }, []);

  const handleSuccess = async (response) => {
    console.log("Token de Google recibido:", response.credential);

    try {
      const backendResponse = await axios.post(
        "https://127.0.0.1:8000/usuarios/google-auth/",
        { token: response.credential },
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("Respuesta del backend:", backendResponse.data);
      alert("Inicio de sesión exitoso");

      // Guardar nombre en localStorage y actualizar el estado
      const name = backendResponse.data.user.first_name || "Usuario";
      localStorage.setItem("userName", name);
      setUserName(name);
    } catch (error) {
      console.error("Error en la autenticación:", error.response ? error.response.data : error);
      alert("Error al autenticar. Revisa la consola.");
    }
  };

  const handleFailure = () => {
    console.error("Error al iniciar sesión con Google");
    alert("Error al iniciar sesión con Google");
  };

  const handleLogout = () => {
    localStorage.removeItem("userName"); // Eliminar datos almacenados
    setUserName(null); // Reiniciar el estado
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div style={{ textAlign: "center", padding: "20px" }}>
        <h2>Iniciar sesión con Google</h2>

        {userName ? (
          <>
            <p>Bienvenido, {userName} 👋</p>
            <button onClick={handleLogout} style={{ padding: "10px", background: "red", color: "white", border: "none", cursor: "pointer", borderRadius: "5px" }}>
              Cerrar sesión
            </button>
          </>
        ) : (
          <GoogleLogin onSuccess={handleSuccess} onError={handleFailure} />
        )}
      </div>
    </GoogleOAuthProvider>
  );
};

export default GoogleLoginButton;

