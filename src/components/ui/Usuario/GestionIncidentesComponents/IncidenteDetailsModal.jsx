import React from 'react';
import { X, AlertTriangle, Calendar } from 'lucide-react';

const IncidenteDetailsModal = ({ incidente, setDetailsModalOpen }) => {
  const getEstadoText = (estado) => {
    switch (estado) {
      case 0: return 'Pendiente';
      case 1: return 'En progreso';
      case 2: return 'Resuelto';
      default: return '-';
    }
  };

  const estadoText = getEstadoText(incidente.estado);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-7 h-7" />
            DETALLES DEL INCIDENTE
          </h2>
          <button onClick={() => setDetailsModalOpen(false)} className="text-white">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800 border-b-2 border-blue-200 pb-2">
                DETALLES DEL INCIDENTE
              </h3>
              <div className="flex items-center gap-2">
                <span className="font-medium">Activo:</span>
                {incidente.activo?.codigo_inventario || '-'}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Descripción:</span>
                {incidente.descripcion || '-'}
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800 border-b-2 border-blue-200 pb-2">
                INFORMACIÓN ADICIONAL
              </h3>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-400" />
                <span className="font-medium">Fecha de Reporte:</span>
                {incidente.fecha_reporte || '-'}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Estado:</span>
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    estadoText === 'Resuelto'
                      ? 'bg-green-100 text-green-800'
                      : estadoText === 'En progreso'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {estadoText}
                </span>
              </div>
            </div>
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
    </div>
  );
};

export default IncidenteDetailsModal;