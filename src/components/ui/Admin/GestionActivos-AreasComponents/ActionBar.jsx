import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';

const ActionBar = ({ activoArea, openEditModal, handleDelete }) => {
  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow mt-4 flex gap-4">
      <button
        onClick={() => openEditModal(activoArea)}
        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        <Pencil className="w-5 h-5" />
        Editar
      </button>
      <button
        onClick={() => handleDelete(activoArea.idActivoArea)}
        className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
      >
        <Trash2 className="w-5 h-5" />
        Eliminar
      </button>
    </div>
  );
};

export default ActionBar;