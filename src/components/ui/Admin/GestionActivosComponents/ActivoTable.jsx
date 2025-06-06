import React from 'react';

const ActivoTable = ({ activos, loading, selectedActivos, handleSelectActivo }) => {
  // Safeguard: Ensure activos is an array, log if invalid
  const safeActivos = Array.isArray(activos) ? activos : [];
  if (!Array.isArray(activos)) {
    console.warn('ActivoTable received invalid activos prop:', activos);
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Código de Inventario
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ubicación
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tipo
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Marca/Modelo
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estado
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {loading ? (
            <tr key="loading-row">
              <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                Cargando activos...
              </td>
            </tr>
          ) : safeActivos.length === 0 ? (
            <tr key="no-activos-row">
              <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                No se encontraron activos
              </td>
            </tr>
          ) : (
            safeActivos.map((activo) => (
              <tr
                key={`activo-row-${activo.id || activo.idActivo}`}
                className={`hover:bg-gray-50 cursor-pointer ${
                  selectedActivos.includes(activo.id || activo.idActivo) ? 'bg-blue-100' : ''
                }`}
                onClick={() => {
                  console.log(`Row clicked for activo ID: ${activo.id || activo.idActivo}`);
                  handleSelectActivo(activo.id || activo.idActivo);
                }}
              >
                <td className="px-6 py-4 whitespace-nowrap">{activo.codigo_inventario || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap">{activo.ubicacion || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap">{activo.tipo || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap">{activo.marca_modelo || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      activo.estado ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {activo.estado ? 'ACTIVO' : 'INACTIVO'}
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

export default ActivoTable;
