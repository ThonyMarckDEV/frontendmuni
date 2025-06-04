import React from 'react';
import { Edit, Eye } from 'lucide-react';

const ActionBar = ({ user, openEditModal, openDetailsModal }) => {
  return (
    <div className="mt-4 bg-white rounded-lg shadow p-4 flex gap-4">
      <button
        onClick={() => openEditModal(user)}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        <Edit className="w-5 h-5" /> EDITAR
      </button>
      <button
        onClick={() => openDetailsModal(user)}
        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
      >
        <Eye className="w-5 h-5" /> VER DETALLES
      </button>
    </div>
  );
};

export default ActionBar;