import React, { useState, useEffect } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./GoogleLoginButton.css";

const GoogleLoginButton = () => {
  const clientId = "64075915222-g6fb8obd0qmgpqtpqdol40m6g5o56o4i.apps.googleusercontent.com";
  const [userName, setUserName] = useState(localStorage.getItem("userName") || null);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("userName");
    if (storedUser) {
      setUserName(storedUser);
    }
  }, []);

  const handleSuccess = async (response) => {
    console.log("Token de Google recibido:", response.credential);

    try {
        const userProfile = jwtDecode(response.credential);
        console.log("Perfil del usuario:", userProfile);

        const backendResponse = await axios.post(
            "https://127.0.0.1:8000/usuarios/google-auth/",
            { token: response.credential },
            { headers: { "Content-Type": "application/json" } }
        );

        console.log("Respuesta del backend:", backendResponse.data);

        // Guardar el accessToken del backend
        const accessToken = backendResponse.data.tokens.access;
        localStorage.setItem("accessToken", accessToken);

        alert("Inicio de sesión exitoso");

        localStorage.setItem("userName", userProfile.name || "Usuario");
        setUserName(userProfile.name);

        navigate("/plantilla", { state: { userData: userProfile } });
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
    localStorage.removeItem("userName");
    localStorage.removeItem("accessToken"); // Eliminar el token
    setUserName(null);
    setUserData(null);
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div
        className="login-container"
        style={{ 
          backgroundImage: "url('https://www1.tecsup.edu.pe/sites/default/files/generic_item/image/lima-galeria.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="login-card">
          <div className="welcome-box">
            <h1 className="welcome-title">Bienvenido a TecCreate</h1>
            <p className="subtitle">Innovación en cada clic</p>
          </div>

          {userName ? (
            <div className="welcome-section">
              <p className="welcome-text">👋 Hola, {userName}</p>
              <button onClick={handleLogout} className="logout-button">
                Cerrar sesión
              </button>
            </div>
          ) : (
            <div className="login-section">
              <GoogleLogin onSuccess={handleSuccess} onError={handleFailure} />
              <p className="footer-text">Al continuar aceptas nuestros Términos y Condiciones</p>
            </div>
          )}
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default GoogleLoginButton;
