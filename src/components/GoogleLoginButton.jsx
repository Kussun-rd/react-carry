import React, { useState, useEffect } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Importa jwtDecode
import "./GoogleLoginButton.css";

const GoogleLoginButton = () => {
  const clientId = "64075915222-g6fb8obd0qmgpqtpqdol40m6g5o56o4i.apps.googleusercontent.com";
  const [userName, setUserName] = useState(localStorage.getItem("userName") || null);
  const [userData, setUserData] = useState(null); // Estado para los datos del usuario
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
      // Decodificar el token de Google para obtener los datos del usuario
      const userProfile = jwtDecode(response.credential);
      console.log("Perfil del usuario:", userProfile);

      // Guardar los datos del usuario en el estado
      setUserData({
        name: userProfile.name, // Nombre completo
        email: userProfile.email, // Correo electrónico
        picture: userProfile.picture, // URL de la foto de perfil
      });

      // Enviar el token al backend (si es necesario)
      const backendResponse = await axios.post(
        "https://127.0.0.1:8000/usuarios/google-auth/",
        { token: response.credential },
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("Respuesta del backend:", backendResponse.data);
      alert("Inicio de sesión exitoso");

      const name = userProfile.name || "Usuario";
      localStorage.setItem("userName", name);
      setUserName(name);

      // Redirigir a la plantilla
      navigate("/plantilla", { state: { userData: userProfile } }); // Pasa los datos del usuario
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
    setUserName(null);
    setUserData(null); // Limpiar los datos del usuario al cerrar sesión
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
              <GoogleLogin
                onSuccess={handleSuccess}
                onError={handleFailure}
                render={(renderProps) => (
                  <button
                    onClick={renderProps.onClick}
                    disabled={renderProps.disabled}
                    className="google-login-button"
                  >
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                      alt="Google Icon"
                      className="google-icon"
                    />
                    Acceder con Google
                  </button>
                )}
              />
              <p className="footer-text">Al continuar aceptas nuestros Términos y Condiciones</p>
            </div>
          )}
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default GoogleLoginButton;