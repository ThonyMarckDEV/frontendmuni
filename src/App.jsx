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
import RegistroUsuarios from './ui/Admin/Registro/RegistroUsuarios';

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

      {/* Rutas Admin */}
      <Route path="/admin" element={<ProtectedRouteAdmin element={<HomeAdmin />} />} />
      <Route path="/admin/registro" element={<ProtectedRouteAdmin element={<RegistroUsuarios />} />} />

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
      <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
        {/* Navbar fijo en la parte superior */}
        {hasToken && <Navbar />}
        
        {/* Container principal con sidebar y contenido */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar fijo a la izquierda */}
          {hasToken && <Sidebar />}
          
          {/* Contenido principal con scroll interno */}
          <main className="flex-1 overflow-y-auto">
            <div className="p-6">
              <AppContent />
            </div>
          </main>
        </div>
        
        {/* Toast notifications */}
        <ToastContainer 
          position="top-right" 
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </Router>
  );
}

export default App;