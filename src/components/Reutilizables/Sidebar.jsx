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
  Menu,
  ChevronDown,
  ChevronRight,
  Wrench,
  Monitor, // Para Activos
  MapPin,  // Para Áreas
  Layers   // Para Activos/Áreas
} from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { logout } from '../../js/logout';
import jwtUtils from '../../utilities/jwtUtils';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUsersDropdownOpen, setIsUsersDropdownOpen] = useState(false);
  const [isActivosDropdownOpen, setIsActivosDropdownOpen] = useState(false);
  const [isIncidentesDropdownOpen, setIsIncidentesDropdownOpen] = useState(false);
  const [isAreasDropdownOpen, setIsAreasDropdownOpen] = useState(false);
  const [isActivosAreasDropdownOpen, setIsActivosAreasDropdownOpen] = useState(false);
  const [isManualToggle, setIsManualToggle] = useState(false);
  const sidebarRef = useRef(null);
  const location = useLocation();

  const token = jwtUtils.getRefreshTokenFromCookie();
  const userRole = jwtUtils.getUserRole(token) || 'usuario';

  const getMenuItems = () => {
    switch (userRole) {
      case 'admin':
        return [
          { icon: Home, label: 'Dashboard', path: '/admin' },
          {
            icon: Users,
            label: 'Gestión y Usuarios',
            subItems: [
              { label: 'Usuarios', path: '/admin/registro-usuarios' },
              { label: 'Gestión', path: '/admin/gestion-usuarios' }
            ]
          },
          {
            icon: Monitor,
            label: 'Activos',
            subItems: [
              { label: 'Activos', path: '/admin/registro-activos' },
              { label: 'Gestión de Activos', path: '/admin/gestion-activos' },
            ]
          },
          {
            icon: MapPin,
            label: 'Áreas',
            subItems: [
              { label: 'Áreas', path: '/admin/registro-areas' },
              { label: 'Gestión de Áreas', path: '/admin/gestion-areas' },
            ]
          },
          {
            icon: Layers,
            label: 'Activos/Áreas',
            subItems: [
              { label: 'Activos - Áreas', path: '/admin/registro-activos-areas' },
              { label: 'Gestión de Activos-Áreas', path: '/admin/gestion-activos-areas' },
            ]
          },
          { icon: AlertTriangle, label: 'Incidentes', path: '/admin/incidentes' },
        ];
      case 'tecnico':
        return [
          { icon: AlertTriangle, label: 'Incidentes', path: '/tecnico/incidentes' },
          { icon: Wrench, label: 'Mantenimiento', path: '/tecnico/mantenimiento' },
        ];
      case 'usuario':
      default:
        return [
          { icon: Home, label: 'Dashboard', path: '/usuario' },
          {
            icon: AlertTriangle,
            label: 'Incidentes',
            subItems: [
              { label: 'Incidentes', path: '/usuario/registro-incidentes' },
              { label: 'Gestión', path: '/usuario/gestion-incidentes' }
            ]
          },
        ];
    }
  };

  const menuItems = getMenuItems();

  const bottomItems = [
    { icon: LogOut, label: 'Log Out', action: 'logout' }
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error in handleLogout:', error);
    } finally {
      setIsOpen(false);
    }
  };

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

  useEffect(() => {
    if (!isManualToggle) {
      const isUsersSubItemActive = menuItems
        .find(item => item.label === 'Gestión y Usuarios')
        ?.subItems?.some(subItem => location.pathname === subItem.path);
      setIsUsersDropdownOpen(isUsersSubItemActive || false);

      const isActivosSubItemActive = menuItems
        .find(item => item.label === 'Activos')
        ?.subItems?.some(subItem => location.pathname === subItem.path);
      setIsActivosDropdownOpen(isActivosSubItemActive || false);

      const isIncidentesSubItemActive = menuItems
        .find(item => item.label === 'Incidentes')
        ?.subItems?.some(subItem => location.pathname === subItem.path);
      setIsIncidentesDropdownOpen(isIncidentesSubItemActive || false);

      const isAreasSubItemActive = menuItems
        .find(item => item.label === 'Áreas')
        ?.subItems?.some(subItem => location.pathname === subItem.path);
      setIsAreasDropdownOpen(isAreasSubItemActive || false);

      const isActivosAreasSubItemActive = menuItems
        .find(item => item.label === 'Activos/Áreas')
        ?.subItems?.some(subItem => location.pathname === subItem.path);
      setIsActivosAreasDropdownOpen(isActivosAreasSubItemActive || false);
    }
  }, [location.pathname, menuItems, isManualToggle]);

  const handleDropdownToggle = (label) => {
    setIsManualToggle(true);
    if (label === 'Gestión y Usuarios') {
      setIsUsersDropdownOpen(prev => !prev);
    } else if (label === 'Activos') {
      setIsActivosDropdownOpen(prev => !prev);
    } else if (label === 'Incidentes') {
      setIsIncidentesDropdownOpen(prev => !prev);
    } else if (label === 'Áreas') {
      setIsAreasDropdownOpen(prev => !prev);
    } else if (label === 'Activos/Áreas') {
      setIsActivosAreasDropdownOpen(prev => !prev);
    }
  };

  const handleSubItemClick = () => {
    setIsOpen(false);
    setIsManualToggle(false);
  };

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
              const isActive = item.subItems
                ? item.subItems.some(subItem => location.pathname === subItem.path)
                : location.pathname === item.path;

              return (
                <li key={index}>
                  {item.subItems ? (
                    <>
                      <button
                        onClick={() => handleDropdownToggle(item.label)}
                        className={`
                          flex items-center w-full px-4 py-3 text-sm transition-colors duration-200 text-left
                          ${isActive 
                            ? 'bg-blue-600 text-white border-r-2 border-blue-400' 
                            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                          }
                        `}
                      >
                        <Icon size={18} className="mr-3" />
                        {item.label}
                        {(item.label === 'Gestión y Usuarios' && isUsersDropdownOpen) || 
                         (item.label === 'Activos' && isActivosDropdownOpen) ||
                         (item.label === 'Áreas' && isAreasDropdownOpen) ||
                         (item.label === 'Activos/Áreas' && isActivosAreasDropdownOpen) ||
                         (item.label === 'Incidentes' && isIncidentesDropdownOpen) ? (
                          <ChevronDown size={18} className="ml-auto" />
                        ) : (
                          <ChevronRight size={18} className="ml-auto" />
                        )}
                      </button>
                      {(item.label === 'Gestión y Usuarios' && isUsersDropdownOpen) || 
                       (item.label === 'Activos' && isActivosDropdownOpen) || 
                       (item.label === 'Áreas' && isAreasDropdownOpen) ||
                       (item.label === 'Activos/Áreas' && isActivosAreasDropdownOpen) ||
                       (item.label === 'Incidentes' && isIncidentesDropdownOpen) ? (
                        <ul className="ml-6 space-y-1">
                          {item.subItems.map((subItem, subIndex) => (
                            <li key={subIndex}>
                              <a
                                href={subItem.path}
                                className={`
                                  flex items-center px-4 py-2 text-sm transition-colors duration-200
                                  ${location.pathname === subItem.path
                                    ? 'bg-blue-600 text-white border-r-2 border-blue-400'
                                    : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                                  }
                                `}
                                onClick={handleSubItemClick}
                              >
                                {subItem.label}
                              </a>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </>
                  ) : (
                    <a
                      href={item.path}
                      className={`
                        flex items-center px-4 py-3 text-sm transition-colors duration-200
                        ${isActive 
                          ? 'bg-blue-600 text-white border-r-2 border-blue-400' 
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                        }
                      `}
                      onClick={() => setIsOpen(false)}
                    >
                      <Icon size={18} className="mr-3" />
                      {item.label}
                    </a>
                  )}
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
                  {item.action === 'logout' ? (
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-2 py-2 text-sm text-gray-400 hover:bg-gray-700 hover:text-white rounded transition-colors duration-200 text-left"
                    >
                      <Icon size={16} className="mr-3" />
                      {item.label}
                    </button>
                  ) : (
                    <a
                      href={item.path}
                      className="flex items-center px-2 py-2 text-sm text-gray-400 hover:bg-gray-700 hover:text-white rounded transition-colors duration-200"
                      onClick={() => setIsOpen(false)}
                    >
                      <Icon size={16} className="mr-3" />
                      {item.label}
                    </a>
                  )}
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
