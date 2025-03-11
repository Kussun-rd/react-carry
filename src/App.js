import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import GoogleLoginButton from "./components/GoogleLoginButton";
import Plantilla from "./components/Plantilla";
import MisPlantillas from "./components/MisPlantillas";
import Sidebar from "./components/Sidebar";

const Layout = ({ children }) => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/";

  return (
    <div className="app-container">
      {!isLoginPage && <Sidebar />} {/* Oculta Sidebar en el login */}
      <div className="main-content">{children}</div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GoogleLoginButton />} />
        <Route
          path="/plantilla"
          element={
            <Layout>
              <Plantilla />
            </Layout>
          }
        />
        <Route
          path="/MisPlantillas"
          element={
            <Layout>
              <MisPlantillas />
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;