import React, { useState } from 'react';
import ActivosComponent from '../../../components/ui/Admin/DashboardComponents/ActivosComponent';
import UsersComponent from '../../../components/ui/Admin/DashboardComponents/UsersComponent';
import DashboardCard from '../../../components/ui/Admin/DashboardComponents/DashboardCard';

const dashboards = [
  { id: 1, title: 'Activos Totales', description: 'Resumen de todos los activos', color: 'bg-blue-500', component: ActivosComponent },
  { id: 2, title: 'Usuarios', description: 'Resumen de usuarios por área', color: 'bg-green-500', component: UsersComponent },
  { id: 3, title: 'Inventario', description: 'Gestión de inventario actual', color: 'bg-purple-500', component: null },
  { id: 4, title: 'Mantenimiento', description: 'Programación de mantenimiento', color: 'bg-orange-500', component: null },
];

const HomeAdmin = () => {
  const [selectedDashboard, setSelectedDashboard] = useState(null);

  const handleCardClick = (dashboard) => {
    setSelectedDashboard(dashboard);
  };

  const handleClose = () => {
    setSelectedDashboard(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Panel de Administración</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboards.map((dashboard) => (
          <DashboardCard
            key={dashboard.id}
            dashboard={dashboard}
            onClick={() => handleCardClick(dashboard)}
          />
        ))}
      </div>
      {selectedDashboard && selectedDashboard.component && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-90 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full h-full flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold">{selectedDashboard.title}</h2>
              <button
                onClick={handleClose}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-lg font-semibold"
              >
                X
              </button>
            </div>
            <div className="flex-1 p-6 overflow-auto">
              {React.createElement(selectedDashboard.component, {
                dashboard: selectedDashboard,
                onClose: handleClose,
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeAdmin;