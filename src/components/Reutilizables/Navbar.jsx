import React from 'react';
import { Menu } from 'lucide-react';

const Navbar = ({ onMenuClick, isAdmin = false, userName = "Usuario", userRole = "Administrador" }) => {
  return (
    <div className="bg-blue-600 text-white px-4 py-3 shadow-lg sticky top-0 z-30">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Botón hamburguesa solo visible en móvil para admin */}
          {isAdmin && (
            <button 
              onClick={onMenuClick}
              className="md:hidden text-white hover:bg-blue-700 p-2 rounded transition-colors duration-200"
            >
              <Menu size={20} />
            </button>
          )}
          
          <div>
            <h1 className="text-lg font-semibold">
              {isAdmin ? `Bienvenido(a), ${userName}` : 'Sistema Municipal'}
            </h1>
            <p className="text-sm text-blue-200">
              {isAdmin ? 'Sistema de Control de Incidentes' : 'Municipalidad de Piura'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-medium">{userName}</div>
            <div className="text-xs text-blue-200">{userRole}</div>
          </div>
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-xs font-semibold">
              {userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;