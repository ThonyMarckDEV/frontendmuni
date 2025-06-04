import React from 'react';
import { Edit, Eye } from 'lucide-react';

const ActionBar = ({ activo, openEditModal, openDetailsModal }) => {
  return (
    <div className="mt-4 flex justify-end gap-3">
      <button
        onClick={() => openEditModal(activo)}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow transition-all duration-200"
      >
        <Edit size={16} />
        Editar
      </button>
      <button
        onClick={() => openDetailsModal(activo)}
        className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg shadow transition-all duration-200"
      >
        <Eye size={16} />
        Ver Detalles
      </button>
    </div>
  );
};

export default ActionBar;