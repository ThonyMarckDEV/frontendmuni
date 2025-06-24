import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { fetchWithAuth } from '../../../../js/authToken';
import API_BASE_URL from '../../../../js/urlHelper';

// Register Chart.js components
ChartJS.register(
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const IncidentesComponent = ({ dashboard, onClose }) => {
  const [dashboardData, setDashboardData] = useState({
    totalIncidents: 0,
    incidentsByStatus: [],
    incidentsDetails: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Map numeric estado values to strings
  const estadoMap = {
    0: 'Pendiente',
    1: 'En progreso',
    2: 'Resuelto',
  };

  // Map numeric prioridad values to strings
  const prioridadMap = {
    0: 'Baja',
    1: 'Media',
    2: 'Alta',
  };

  // Fetch data from the backend
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetchWithAuth(`${API_BASE_URL}/api/incidents-data`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Full API Response:', data);

        if (!data) {
          throw new Error('Invalid or empty response from server');
        }

        const { totalIncidents = 0, incidentsByStatus = [], incidentsDetails = [] } = data;
        console.log('Parsed Data:', { totalIncidents, incidentsByStatus, incidentsDetails });

        setDashboardData({
          totalIncidents,
          incidentsByStatus,
          incidentsDetails,
        });
      } catch (error) {
        console.error('Error fetching incidents dashboard data:', error.message, error);
        setError('Failed to load incidents dashboard data. Please check your connection or try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Configuración para el gráfico de dona (Incidentes por Estado)
  const doughnutChartData = {
    labels: dashboardData.incidentsByStatus.map((item) => item.status),
    datasets: [
      {
        data: dashboardData.incidentsByStatus.map((item) => item.count),
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)', // Pendiente
          'rgba(255, 206, 86, 0.8)', // En progreso
          'rgba(75, 192, 192, 0.8)', // Resuelto
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 2,
        hoverBackgroundColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
        ],
      },
    ],
  };

  const doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          font: { size: 12, weight: 'bold' },
          generateLabels: function (chart) {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label, i) => {
                const dataset = data.datasets[0];
                const value = dataset.data[i];
                const percentage = ((value / dashboardData.totalIncidents) * 100).toFixed(1);
                return {
                  text: `${label}: ${value} (${percentage}%)`,
                  fillStyle: dataset.backgroundColor[i],
                  strokeStyle: dataset.borderColor[i],
                  lineWidth: dataset.borderWidth,
                  index: i,
                };
              });
            }
            return [];
          },
        },
      },
      title: {
        display: true,
        text: 'Distribución de Incidentes por Estado',
        font: { size: 16, weight: 'bold' },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        callbacks: {
          label: function (context) {
            const percentage = ((context.parsed / dashboardData.totalIncidents) * 100).toFixed(1);
            return `${context.label}: ${context.parsed} incidentes (${percentage}%)`;
          },
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando datos del dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{dashboard.title}</h1>
          <p className="text-gray-600">{dashboard.description}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center">
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-700">Total de Incidentes</h2>
                <p className="text-3xl font-bold text-blue-600">{dashboardData.totalIncidents}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center">
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-700">Incidentes Resueltos</h2>
                <p className="text-3xl font-bold text-green-600">
                  {dashboardData.incidentsByStatus.find(item => item.status === 'Resuelto')?.count || 0}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
            <div className="flex items-center">
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-700">Incidentes Pendientes</h2>
                <p className="text-3xl font-bold text-red-600">
                  {dashboardData.incidentsByStatus.find(item => item.status === 'Pendiente')?.count || 0}
                </p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="h-96">
            <Doughnut data={doughnutChartData} options={doughnutChartOptions} />
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Detalle de Incidentes Asignados</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Título
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prioridad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Área
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Activo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha de Reporte
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reportado Por
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Comentarios Técnico
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dashboardData.incidentsDetails.map((incident, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {incident.titulo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {prioridadMap[incident.prioridad] || incident.prioridad}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {estadoMap[incident.estado] || incident.estado}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {incident.area || 'Sin área'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {incident.activo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(incident.fecha_reporte).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {incident.reportado_por || 'Desconocido'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {incident.comentarios_tecnico || 'Sin comentarios'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncidentesComponent;