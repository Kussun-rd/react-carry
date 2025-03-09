import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import GoogleLoginButton from "./components/GoogleLoginButton";
import Plantilla from "./components/Plantilla";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GoogleLoginButton />} /> {/* Ruta del login */}
        <Route path="/plantilla" element={<Plantilla />} /> {/* Ruta de la plantilla */}
      </Routes>
    </Router>
  );
};

export default App;