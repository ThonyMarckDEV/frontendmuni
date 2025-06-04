import React from 'react';

const IncidenteTable = ({ incidentes, loading, selectedIncidentes, handleSelectIncidente }) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
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
              Estado
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {loading ? (
            <tr key="loading-row">
              <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                Cargando incidentes...
              </td>
            </tr>
          ) : incidentes.length === 0 ? (
            <tr key="no-incidentes-row">
              <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                No se encontraron incidentes
              </td>
            </tr>
          ) : (
            incidentes.map((incidente) => (
              <tr
                key={`incidente-row-${incidente.id}`}
                className={`hover:bg-gray-50 cursor-pointer ${
                  selectedIncidentes.includes(incidente.id) ? 'bg-blue-100' : ''
                }`}
                onClick={() => {
                  console.log(`Row clicked for incidente ID: ${incidente.id}`);
                  handleSelectIncidente(incidente.id);
                }}
              >
                <td className="px-6 py-4 whitespace-nowrap">{incidente.activo?.codigo_inventario || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap">{incidente.descripcion || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap">{incidente.fecha_reporte || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      incidente.estado === 'Resuelto'
                        ? 'bg-green-100 text-green-800'
                        : incidente.estado === 'En Proceso'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {incidente.estado || '-'}
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