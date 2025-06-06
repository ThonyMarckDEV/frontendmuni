import React from 'react';
import { X } from 'lucide-react';

const AreaDetailsModal = ({ area, setDetailsModalOpen }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h-4m-6 0H5a2 2 0 001 1.732V23m12-1.268A2 2 0 0019 23v-2"
              />
            </svg>
            DETALLES DEL ÁREA
          </h2>
          <button onClick={() => setDetailsModalOpen(false)} className="text-gray-600 hover:text-gray-800">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="space-y-4">
          <p>
            <strong>Nombre:</strong> {area.nombre || '-'}
          </p>
          <p>
            <strong>ID:</strong> {area.idArea || '-'}
          </p>
          <p>
            <strong>Fecha de Creación:</strong> {area.created_at ? new Date(area.created_at).toLocaleDateString() : '-'}
          </p>
          <p>
            <strong>Última Actualización:</strong> {area.updated_at ? new Date(area.updated_at).toLocaleDateString() : '-'}
          </p>
        </div>
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => setDetailsModalOpen(false)}
            className="bg-gray-300 text-gray-800 font-bold py-4 px-12 rounded-lg shadow-lg hover:bg-gray-400"
          >
            CERRAR
          </button>
        </div>
      </div>
    </div>
  );
};

export default AreaDetailsModal;
