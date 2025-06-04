import React, { useState, useEffect } from 'react';
import { 
  Home, 
  FileText, 
  Users, 
  AlertTriangle, 
  Bell, 
  Settings, 
  Phone, 
  HelpCircle, 
  LogOut,
  X
} from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const menuItems = [
    { icon: Home, label: 'Dashboard', active: false, path: '/admin' },
    { icon: FileText, label: 'Registro', active: false, path: '/admin/registro' },
    { icon: Users, label: 'Usuarios', active: true, path: '/admin/usuarios' },
    { icon: AlertTriangle, label: 'Incidentes', active: false, path: '/admin/incidentes' },
    { icon: Bell, label: 'Notificaciones', active: false, path: '/admin/notificaciones' },
    { icon: Settings, label: 'Activos', active: false, path: '/admin/activos' }
  ];

  const bottomItems = [
    { icon: Phone, label: 'Call Center', path: '/admin/call-center' },
    { icon: HelpCircle, label: 'Help', path: '/admin/help' },
    { icon: LogOut, label: 'Log Out', path: '/logout' }
  ];

  return (
    <>
      {/* Overlay para móvil */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-64 bg-gray-800 text-white z-50 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static md:z-auto
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
              <span className="text-white text-xs font-bold">MP</span>
            </div>
            <div>
              <div className="text-sm font-semibold text-blue-300">Municipalidad</div>
              <div className="text-xs text-gray-400">de Piura</div>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="md:hidden text-gray-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 py-4">
          <ul className="space-y-1">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <li key={index}>
                  <a
                    href={item.path}
                    className={`
                      flex items-center px-4 py-3 text-sm transition-colors duration-200
                      ${item.active 
                        ? 'bg-blue-600 text-white border-r-2 border-blue-400' 
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      }
                    `}
                    onClick={() => setIsOpen && setIsOpen(false)}
                  >
                    <Icon size={18} className="mr-3" />
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom Items */}
        <div className="border-t border-gray-700 p-4">
          <ul className="space-y-1">
            {bottomItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <li key={index}>
                  <a
                    href={item.path}
                    className="flex items-center px-2 py-2 text-sm text-gray-400 hover:bg-gray-700 hover:text-white rounded transition-colors duration-200"
                    onClick={() => setIsOpen && setIsOpen(false)}
                  >
                    <Icon size={16} className="mr-3" />
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Sidebar;