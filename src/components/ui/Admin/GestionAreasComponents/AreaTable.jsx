import React from 'react';

const AreaTable = ({ areas, loading, selectedAreas, handleSelectArea }) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nombre del Área
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {loading ? (
            <tr key="loading-row">
              <td className="px-6 py-4 text-center text-gray-500">Cargando áreas...</td>
            </tr>
          ) : areas.length === 0 ? (
            <tr key="no-areas-row">
              <td className="px-6 py-4 text-center text-gray-500">No se encontraron áreas</td>
            </tr>
          ) : (
            areas.map((area) => (
              <tr
                key={`area-row-${area.idArea}`}
                className={`hover:bg-gray-50 cursor-pointer ${
                  selectedAreas.includes(area.idArea) ? 'bg-blue-100' : ''
                }`}
                onClick={() => {
                  console.log(`Row clicked for area ID: ${area.idArea}`);
                  handleSelectArea(area.idArea);
                }}
              >
                <td className="px-6 py-4 whitespace-nowrap">{area.nombre || '-'}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AreaTable;
