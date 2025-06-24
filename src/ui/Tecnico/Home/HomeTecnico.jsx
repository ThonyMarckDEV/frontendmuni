import React, { useState } from 'react';
import DashboardCard from '../../../components/ui/Usuario/DashboardComponents/DashboardCard';
import IncidentesComponent from '../../../components/ui/Usuario/DashboardComponents/IncidentesComponent';

const dashboards = [
  { id: 1, title: 'Incidentes Asignados', description: 'Resumen de los incidentes asignados a ti', color: 'bg-orange-500', component: IncidentesComponent },
];

const HomeTecnico = () => {
  const [selectedDashboard, setSelectedDashboard] = useState(null);

  const handleCardClick = (dashboard) => {
    setSelectedDashboard(dashboard);
  };

  const handleClose = () => {
    setSelectedDashboard(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Panel de Técnico</h1>
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

export default HomeTecnico;