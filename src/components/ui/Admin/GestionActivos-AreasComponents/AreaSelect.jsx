import React from 'react';
import { Building } from 'lucide-react';

const AreaSelect = ({ selectedArea, setSelectedArea, areas, loadingAreas }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="relative">
        <Building className="absolute left-3 top-3 w-5 h-5 text-gray-400 z-10" />
        <select
          value={selectedArea}
          onChange={(e) => setSelectedArea(e.target.value)}
          disabled={loadingAreas}
          className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white ${
            loadingAreas ? 'cursor-not-allowed opacity-50' : ''
          }`}
        >
          {loadingAreas ? (
            <option value="" disabled>
              CARGANDO ÁREAS...
            </option>
          ) : areas.length === 0 ? (
            <option value="" disabled>
              NO HAY ÁREAS DISPONIBLES
            </option>
          ) : (
            <>
              <option value="">SELECCIONE ÁREA</option>
              {areas.map((area) => (
                <option key={area.idArea} value={area.idArea}>
                  {area.nombre.toUpperCase()}
                </option>
              ))}
            </>
          )}
        </select>
        <div className="absolute right-3 top-3 pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default AreaSelect;
