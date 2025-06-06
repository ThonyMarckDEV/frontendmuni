import React from 'react';
import { Edit, Trash } from 'lucide-react';

const ActionBar = ({ activoArea, openEditModal, handleDelete }) => {
  return (
    <div className="mt-4 bg-white rounded-lg shadow p-4 flex gap-4">
      <button
        onClick={() => openEditModal(activoArea)}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        <Edit className="w-5 h-5" /> EDITAR
      </button>
      <button
        onClick={() => handleDelete(activoArea.id)}
        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
      >
        <Trash className="w-5 h-5" /> ELIMINAR
      </button>
    </div>
  );
};

export default ActionBar;
