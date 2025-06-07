import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const IncidenteTable = ({ incidentes, loading, selectedIncidentes, handleSelectIncidente }) => {
  const getEstadoText = (estado) => {
    switch (estado) {
      case 0: return 'Pendiente';
      case 1: return 'En progreso';
      case 2: return 'Resuelto';
      default: return '-';
    }
  };

  const getPrioridadText = (prioridad) => {
    switch (prioridad) {
      case 0: return 'Baja';
      case 1: return 'Media';
      case 2: return 'Alta';
      default: return '-';
    }
  };

  const formatDate = (date) => {
    try {
      return format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: es });
    } catch {
      return '-';
    }
  };

  const formatActivo = (activo) => {
    if (!activo) return '-';
    return `COD: ${activo.codigo_inventario} - TIPO: ${activo.tipo} - MARCA: ${activo.marca_modelo} - UBICACION: ${activo.ubicacion} `;
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Área
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Activo
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Descripción
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fecha de Reporte
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Prioridad
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estado
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {loading ? (
            <tr key="loading-row">
              <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                Cargando incidentes...
              </td>
            </tr>
          ) : incidentes.length === 0 ? (
            <tr key="no-incidentes-row">
              <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                No se encontraron incidentes
              </td>
            </tr>
          ) : (
            incidentes.map((incidente) => (
              <tr
                key={`incidente-row-${incidente.idIncidente}`}
                className={`hover:bg-gray-50 cursor-pointer ${
                  selectedIncidentes.includes(incidente.idIncidente) ? 'bg-blue-100' : ''
                }`}
                onClick={() => {
                  console.log(`Row clicked for incidente ID: ${incidente.idIncidente}`);
                  handleSelectIncidente(incidente.idIncidente);
                }}
              >
                <td className="px-6 py-4 whitespace-nowrap">{incidente.area?.nombre?.toUpperCase() || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap">{formatActivo(incidente.activo)}</td>
                <td className="px-6 py-4 whitespace-nowrap">{incidente.descripcion || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap">{formatDate(incidente.fecha_reporte)}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      incidente.prioridad === 2
                        ? 'bg-red-100 text-red-800'
                        : incidente.prioridad === 1
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {getPrioridadText(incidente.prioridad)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      incidente.estado === 2
                        ? 'bg-green-100 text-green-800'
                        : incidente.estado === 1
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {getEstadoText(incidente.estado)}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default IncidenteTable;
