import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import 'react-toastify/dist/ReactToastify.css';
import jwtUtils from './utilities/jwtUtils';

// Componentes Globales
import { ToastContainer } from 'react-toastify';
import Navbar from './components/Reutilizables/Navbar';
import Sidebar from './components/Reutilizables/Sidebar';

// Componentes Home
import HomeUI from './ui/Home';

// UIS AUTH
import ErrorPage from './components/ErrorPage';
import ErrorPage401 from './components/ErrorPage401';
import LoginUI from './ui/Home';

// UIS ADMIN
import HomeAdmin from './ui/Admin/Home/HomeAdmin';

// UIS Cliente


// Utilities
import ProtectedRouteHome from './utilities/ProtectedRouteHome';
import ProtectedRouteUsuario from './utilities/ProtectedRouteUsuario';
import ProtectedRouteAdmin from './utilities/ProtectedRouteAdmin';
import ProtectedRouteTecnico from './utilities/ProtectedRouteTecnico';

function AppContent() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<ProtectedRouteHome element={<HomeUI />} />} />
      <Route path="/login" element={<ProtectedRouteHome element={<LoginUI />} />} />

      {/* Rutas Usuario */}


      {/* Rutas Admin */}
      <Route path="/admin" element={<ProtectedRouteAdmin element={<HomeAdmin />} />} />

      {/* Ruta de error */}
      <Route path="/*" element={<ErrorPage />} />
      <Route path="/401" element={<ErrorPage401 />} />
    </Routes>
  );
}

function App() {
  const [hasToken, setHasToken] = useState(() => {
    return !!jwtUtils.getRefreshTokenFromCookie();
  });

  useEffect(() => {
    const checkToken = () => {
      const tokenExists = !!jwtUtils.getRefreshTokenFromCookie();
      if (tokenExists !== hasToken) {
        setHasToken(tokenExists);
      }
    };

    checkToken();
    window.addEventListener('popstate', checkToken);
    const interval = setInterval(checkToken, 1000);

    return () => {
      window.removeEventListener('popstate', checkToken);
      clearInterval(interval);
    };
  }, [hasToken]);

  return (
    <Router>
      <div className="bg-white">
        {hasToken && (
          <>
            <Navbar />
            <Sidebar />
          </>
        )}
        <div className={`flex-1 ${hasToken ? 'md:ml-64' : ''}`}>
          <AppContent />
          <ToastContainer position="top-right" autoClose={3000} />
        </div>
      </div>
    </Router>
  );
}

export default App;