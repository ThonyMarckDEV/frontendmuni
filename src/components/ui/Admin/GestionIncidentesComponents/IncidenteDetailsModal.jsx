import React, { useState } from 'react';
import { X, AlertTriangle, Calendar, Download, Building } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { fetchWithAuth } from '../../../../js/authToken';
import API_BASE_URL from '../../../../js/urlHelper';
import FetchWithGif from '../../../../components/Reutilizables/FetchWithGif';

const IncidenteDetailsModal = ({ incidente, setDetailsModalOpen }) => {
  const [isLoading, setIsLoading] = useState(false);

  const getEstadoText = (estado) => {
    switch (estado) {
      case 0: return 'Pendiente';
      case 1: return 'En progreso';
      case 2: return 'Resuelto';
      default: return '-';
    }
  };

  const getPrioridadText = (prioridad) => {
    switch (prioridad) {
      case 0: return 'Baja';
      case 1: return 'Media';
      case 2: return 'Alta';
      default: return '-';
    }
  };

  const formatDate = (date) => {
    try {
      return format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: es });
    } catch (error) {
      return '-';
    }
  };

  const formatActivo = (activo) => {
    if (!activo) return '-';
    return `COD: ${activo.codigo_inventario} - TIPO: ${activo.tipo} - MARCA: ${activo.marca_modelo} - UBICACION: ${activo.ubicacion}`;
  };

  const formatComentariosTecnico = (comentarios) => {
    return comentarios ? comentarios : 'Sin comentarios';
  };

  const formatNombreTecnico = (tecnico) => {
    if (!tecnico || !tecnico.nombre || !tecnico.apellido) return 'Sin técnico asignado';
    return `${tecnico.nombre} ${tecnico.apellido}`;
  };

  const estadoText = getEstadoText(incidente.estado);
  const prioridadText = getPrioridadText(incidente.prioridad);

  const handleDownloadPdf = async () => {
    setIsLoading(true);
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/api/incidentes/${incidente.idIncidente}/pdf`, {
        method: 'GET',
        headers: {
          'Accept': 'application/pdf',
        },
      });

      if (!response.ok) {
        throw new Error('Error al generar el PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `incidente_${incidente.idIncidente}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Error al descargar el PDF');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <FetchWithGif />}
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
                  <Building className="w-5 h-5 text-gray-400" />
                  <span className="font-medium">Área:</span>
                  {incidente.area?.nombre?.toUpperCase() || '-'}
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Activo:</span>
                  {formatActivo(incidente.activo)}
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Descripción:</span>
                  {incidente.descripcion || '-'}
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Prioridad:</span>
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      prioridadText === 'Alta'
                        ? 'bg-red-100 text-red-800'
                        : prioridadText === 'Media'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {prioridadText}
                  </span>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-800 border-b-2 border-blue-200 pb-2">
                  INFORMACIÓN ADICIONAL
                </h3>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <span className="font-medium">Fecha de Reporte:</span>
                  {formatDate(incidente.fecha_reporte)}
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
                <div className="flex items-center gap-2">
                  <span className="font-medium">Técnico Asignado:</span>
                  {formatNombreTecnico(incidente.tecnico)}
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Comentarios Técnico:</span>
                  {formatComentariosTecnico(incidente.comentarios_tecnico)}
                </div>
              </div>
            </div>
            <div className="mt-8 flex justify-center gap-4">
              <button
                onClick={handleDownloadPdf}
                disabled={isLoading}
                className={`bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 px-12 rounded-lg shadow-lg transform transition-all duration-200 flex items-center gap-2 ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <Download className="w-5 h-5" />
                DESCARGAR PDF
              </button>
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
    </>
  );
};

export default IncidenteDetailsModal;