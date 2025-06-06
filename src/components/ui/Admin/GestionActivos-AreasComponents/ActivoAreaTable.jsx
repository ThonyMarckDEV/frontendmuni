import React from 'react';

const ActivoAreaTable = ({ assignedActivos, loadingAssigned, selectedActivoArea, handleSelectActivoArea }) => {
  // Filter out invalid items and log them for debugging
  const validActivos = assignedActivos.filter((activo) => {
    if (!activo.id && !activo.idActivo) {
      console.warn('Invalid activo in assignedActivos:', activo);
      return false;
    }
    return true;
  });

  return (
    <div className="bg-white rounded-lg shadow overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Código Inventario
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
          {loadingAssigned ? (
            <tr key="loading-row">
              <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                Cargando activos asignados...
              </td>
            </tr>
          ) : validActivos.length === 0 ? (
            <tr key="no-activos-row">
              <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                No hay activos asignados a esta área
              </td>
            </tr>
          ) : (
            validActivos.map((activo, index) => (
              <tr
                key={`activo-area-row-${activo.id || activo.idActivo || index}`}
                className={`hover:bg-gray-50 cursor-pointer ${
                  selectedActivoArea === (activo.id || activo.idActivo) ? 'bg-blue-100' : ''
                }`}
                onClick={() => handleSelectActivoArea(activo.id || activo.idActivo)}
              >
                <td className="px-6 py-4 whitespace-nowrap">{activo.codigo_inventario || '-'}</td>
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

export default ActivoAreaTable;
