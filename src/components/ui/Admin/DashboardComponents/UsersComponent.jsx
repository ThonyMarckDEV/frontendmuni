import React, { useState, useEffect, useCallback } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { fetchWithAuth } from '../../../../js/authToken';
import API_BASE_URL from '../../../../js/urlHelper';
import Pagination from '../../../Reutilizables/Pagination';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const UsersComponent = ({ dashboard, onClose }) => {
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    usersByArea: [],
    usersDetails: [],
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    total: 0,
    perPage: 10,
    from: 0,
    to: 0,
    hasMorePages: false,
  });
  const [filters, setFilters] = useState({
    area: 'all',
    name: '',
    role: 'all',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Debounce function for name input
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  // Fetch data from the backend
  const fetchDashboardData = async (page = 1, perPage = 10, filters = {}) => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams({
        page,
        per_page: perPage,
        ...(filters.area !== 'all' && { area: filters.area === 'null' ? 'null' : filters.area }),
        ...(filters.name && { name: filters.name }),
        ...(filters.role !== 'all' && { role: filters.role }),
      });

      const response = await fetchWithAuth(
        `${API_BASE_URL}/api/users-by-area?${queryParams.toString()}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Full API Response:', data);

      if (!data) {
        throw new Error('Invalid or empty response from server');
      }

      const { totalUsers = 0, usersByArea = [], usersDetails } = data;
      console.log('Parsed Data:', { totalUsers, usersByArea, usersDetails });

      setDashboardData({
        totalUsers,
        usersByArea,
        usersDetails: usersDetails.data || [],
      });

      setPagination({
        currentPage: usersDetails.current_page || 1,
        lastPage: usersDetails.last_page || 1,
        total: usersDetails.total || 0,
        perPage: usersDetails.per_page || perPage,
        from: usersDetails.from || 0,
        to: usersDetails.to || 0,
        hasMorePages: usersDetails.current_page < usersDetails.last_page,
      });
    } catch (error) {
      console.error('Error fetching user dashboard data:', error.message, error);
      setError('Failed to load user dashboard data. Please check your connection or try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Debounced fetch for name filter
  const debouncedFetch = useCallback(
    debounce((page, perPage, filters) => {
      fetchDashboardData(page, perPage, filters);
    }, 500),
    []
  );

  // Initial fetch
  useEffect(() => {
    fetchDashboardData(pagination.currentPage, pagination.perPage, filters);
  }, []);

  // Handle page change
  const handlePageChange = (page) => {
    fetchDashboardData(page, pagination.perPage, filters);
  };

  // Handle per-page change
  const handlePerPageChange = (perPage) => {
    fetchDashboardData(1, perPage, filters);
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => {
      const newFilters = { ...prev, [name]: value };
      // Reset to page 1 when filters change
      if (name !== 'name') {
        fetchDashboardData(1, pagination.perPage, newFilters);
      } else {
        debouncedFetch(1, pagination.perPage, newFilters);
      }
      return newFilters;
    });
  };

  // Bar Chart Configuration
  const barChartData = {
    labels: dashboardData.usersByArea.map((item) => item.area || ''), // Display null as empty string
    datasets: [
      {
        label: 'Número de Usuarios',
        data: dashboardData.usersByArea.map((item) => item.count),
        backgroundColor: [
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 99, 132, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: { size: 12, weight: 'bold' },
        },
      },
      title: {
        display: true,
        text: `Distribución de Usuarios por Área (Total: ${dashboardData.totalUsers})`,
        font: { size: 16, weight: 'bold' },
        padding: { top: 10, bottom: 30 },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        callbacks: {
          label: function (context) {
            const percentage = ((context.parsed.y / dashboardData.totalUsers) * 100).toFixed(1);
            return `${context.dataset.label}: ${context.parsed.y} (${percentage}%)`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1, font: { size: 12 } },
        grid: { color: 'rgba(0, 0, 0, 0.1)' },
      },
      x: {
        ticks: { font: { size: 12, weight: 'bold' } },
        grid: { display: false },
      },
    },
  };

  // Doughnut Chart Configuration
  const doughnutChartData = {
    labels: dashboardData.usersByArea.map((item) => item.area || ''), // Display null as empty string
    datasets: [
      {
        data: dashboardData.usersByArea.map((item) => item.count),
        backgroundColor: [
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 99, 132, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 2,
        hoverBackgroundColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
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
                const percentage = ((value / dashboardData.totalUsers) * 100).toFixed(1);
                return {
                  text: `${label || 'Sin Área'}: ${value} (${percentage}%)`, // Display null as 'Sin Área' in legend
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
        text: 'Distribución Porcentual de Clientes',
        font: { size: 16, weight: 'bold' },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        callbacks: {
          label: function (context) {
            const percentage = ((context.parsed / dashboardData.totalUsers) * 100).toFixed(1);
            return `${context.label || 'Sin Área'}: ${context.parsed} clientes (${percentage}%)`;
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
                <h2 className="text-lg font-semibold text-gray-700">Total de Usuarios</h2>
                <p className="text-3xl font-bold text-blue-600">{dashboardData.totalUsers}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5c2.76 0 5 2.24 5 5s-2.24 5-5 5-5-2.24-5-5 2.24-5 5-5zm0 12c-3.31 0-6 2.69-6 6h12c0-3.31-2.69-6-6-6z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center">
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-700">Áreas con Usuarios</h2>
                <p className="text-3xl font-bold text-green-600">{dashboardData.usersByArea.length}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l7-3 7 3z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center">
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-700">Promedio por Área</h2>
                <p className="text-3xl font-bold text-purple-600">
                  {dashboardData.usersByArea.length > 0
                    ? (dashboardData.totalUsers / dashboardData.usersByArea.length).toFixed(1)
                    : '0'}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>


        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Bar Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="h-96">
              <Bar data={barChartData} options={barChartOptions} />
            </div>
          </div>

          {/* Doughnut Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="h-96">
              <Doughnut data={doughnutChartData} options={doughnutChartOptions} />
            </div>
          </div>
        </div>

         {/* Filter Form */}
        <div className="mb-6 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Filtros</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="area" className="block text-sm font-medium text-gray-700">
                Área
              </label>
              <select
                id="area"
                name="area"
                value={filters.area}
                onChange={handleFilterChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="all">Todas las áreas</option>
                <option value="null">Sin Área</option>
                {dashboardData.usersByArea
                  .filter((item) => item.area !== null)
                  .map((item, index) => (
                    <option key={index} value={item.area}>
                      {item.area}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nombre o Apellido
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={filters.name}
                onChange={handleFilterChange}
                placeholder="Buscar por nombre o apellido"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Detalle de Usuarios por Área</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Área
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Apellido
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rol
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dashboardData.usersDetails.map((user, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user.area || 'Sin Área'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.nombre}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.apellido}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.rol}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={pagination.currentPage}
            lastPage={pagination.lastPage}
            total={pagination.total}
            perPage={pagination.perPage}
            from={pagination.from}
            to={pagination.to}
            hasMorePages={pagination.hasMorePages}
            onPageChange={handlePageChange}
            onPerPageChange={handlePerPageChange}
            loading={loading}
            showPerPageSelector={true}
            perPageOptions={[5, 8, 10, 15, 20, 25]}
          />
        </div>
      </div>
    </div>
  );
};

export default UsersComponent;