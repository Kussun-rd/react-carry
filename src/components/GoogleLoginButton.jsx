import React, { useState, useEffect } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./GoogleLoginButton.css";

const GoogleLoginButton = () => {
  const clientId = "64075915222-g6fb8obd0qmgpqtpqdol40m6g5o56o4i.apps.googleusercontent.com";
  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("userData")) || null
  );
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userData"));
    if (storedUser) {
      setUserData(storedUser);
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

      // Guardar userData en localStorage
      localStorage.setItem("userData", JSON.stringify(userProfile));
      setUserData(userProfile);

      alert("Inicio de sesión exitoso");
      navigate("/plantilla");
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
    localStorage.removeItem("userData");
    localStorage.removeItem("accessToken");
    setUserData(null);
    navigate("/");
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

          {userData ? (
            <div className="welcome-section">
              <p className="welcome-text">👋 Hola, {userData.name}</p>
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
