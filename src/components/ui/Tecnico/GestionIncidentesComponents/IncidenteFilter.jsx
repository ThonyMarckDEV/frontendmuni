import React, { useState } from 'react';
import { Calendar, X, Search } from 'lucide-react';

const IncidenteFilter = ({ onApplyFilters, onClearFilters }) => {
  const [filters, setFilters] = useState({
    idIncidente: '',
    estado: '1', // Default to En Progreso
    fecha_inicio: '',
    fecha_fin: '',
  });

  const [errors, setErrors] = useState({});

  const validateFilters = () => {
    const newErrors = {};
    if (filters.idIncidente && isNaN(filters.idIncidente)) {
      newErrors.idIncidente = 'El ID debe ser un número';
    }
    if (filters.fecha_inicio && filters.fecha_fin && new Date(filters.fecha_inicio) > new Date(filters.fecha_fin)) {
      newErrors.fecha_fin = 'La fecha final no puede ser anterior a la inicial';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyFilters = () => {
    if (validateFilters()) {
      onApplyFilters(filters);
    }
  };

  const handleClearFilters = () => {
    const defaultFilters = {
      idIncidente: '',
      estado: '1', // Reset to En Progreso
      fecha_inicio: '',
      fecha_fin: '',
    };
    setFilters(defaultFilters);
    setErrors({});
    onClearFilters(defaultFilters);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Search className="w-5 h-5" />
        Filtros de Incidentes
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* ID Incidente */}
        <div>
          <label htmlFor="idIncidente" className="block text-sm font-medium text-gray-700 mb-1">
            ID Incidente
          </label>
          <input
            type="text"
            id="idIncidente"
            name="idIncidente"
            value={filters.idIncidente}
            onChange={handleInputChange}
            placeholder="Ingrese ID"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
          {errors.idIncidente && <p className="text-red-500 text-xs mt-1">{errors.idIncidente}</p>}
        </div>

        {/* Estado */}
        <div>
          <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-1">
            Estado
          </label>
          <select
            id="estado"
            name="estado"
            value={filters.estado}
            onChange={handleInputChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="all">Todos</option>
            <option value="1">En Progreso</option>
            <option value="2">Resuelto</option>
          </select>
        </div>

        {/* Fecha Inicio */}
        <div>
          <label htmlFor="fecha_inicio" className="block text-sm font-medium text-gray-700 mb-1">
            Fecha Inicio
          </label>
          <div className="relative">
            <input
              type="date"
              id="fecha_inicio"
              name="fecha_inicio"
              value={filters.fecha_inicio}
              onChange={handleInputChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm pl-10"
            />
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Fecha Fin */}
        <div>
          <label htmlFor="fecha_fin" className="block text-sm font-medium text-gray-700 mb-1">
            Fecha Fin
          </label>
          <div className="relative">
            <input
              type="date"
              id="fecha_fin"
              name="fecha_fin"
              value={filters.fecha_fin}
              onChange={handleInputChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm pl-10"
            />
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
          {errors.fecha_fin && <p className="text-red-500 text-xs mt-1">{errors.fecha_fin}</p>}
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-6 flex justify-end gap-4">
        <button
          onClick={handleClearFilters}
          className="flex items-center gap-2 bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg hover:bg-gray-400 transition-colors"
        >
          <X className="w-4 h-4" />
          Limpiar
        </button>
        <button
          onClick={handleApplyFilters}
          className="flex items-center gap-2 bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Search className="w-4 h-4" />
          Aplicar
        </button>
      </div>
    </div>
  );
};

export default IncidenteFilter;