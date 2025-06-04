import React, { useState, useEffect, useRef } from 'react';
import { 
  Home, 
  FileText, 
  Users, 
  AlertTriangle, 
  Bell, 
  Settings, 
  LogOut,
  X,
  Menu
} from 'lucide-react';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef(null);

  const menuItems = [
    { icon: Home, label: 'Dashboard', active: false, path: '/admin' },
    { icon: FileText, label: 'Registro', active: false, path: '/admin/registro' },
    { icon: Users, label: 'Usuarios', active: true, path: '/admin/usuarios' },
    { icon: AlertTriangle, label: 'Incidentes', active: false, path: '/admin/incidentes' },
    { icon: Bell, label: 'Notificaciones', active: false, path: '/admin/notificaciones' },
    { icon: Settings, label: 'Activos', active: false, path: '/admin/activos' }
  ];

  const bottomItems = [
    { icon: LogOut, label: 'Log Out', path: '/logout' }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors duration-200"
      >
        <Menu size={24} />
      </button>

      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      <div 
        ref={sidebarRef}
        className={`
          fixed left-0 w-64 bg-gray-800 text-white z-50 transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:static md:z-auto
          flex flex-col top-[4.5rem] h-[calc(100vh-4.5rem)]
        `}
      >
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

        <nav className="flex-1 py-4 overflow-y-auto">
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
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon size={18} className="mr-3" />
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-gray-700 p-4">
          <ul className="space-y-1">
            {bottomItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <li key={index}>
                  <a
                    href={item.path}
                    className="flex items-center px-2 py-2 text-sm text-gray-400 hover:bg-gray-700 hover:text-white rounded transition-colors duration-200"
                    onClick={() => setIsOpen(false)}
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