import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import ActionBar from './ActionBar';

const IncidenteTable = ({ incidentes, loading, selectedIncidentes, handleSelectIncidente, openEditModal, openDetailsModal }) => {
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
    } catch {
      return '-';
    }
  };

  const formatActivo = (activo) => {
    if (!activo) return '-';
    return `COD: ${activo.codigo_inventario} - TIPO: ${activo.tipo} - MARCA: ${activo.marca_modelo} - UBICACION: ${activo.ubicacion}`;
  };

  const formatTecnico = (tecnico) => {
    if (!tecnico) return 'No asignado';
    return `${tecnico.nombre} ${tecnico.apellido}`;
  };

  return (
    <div className="p-4">
      {loading ? (
        <div className="text-center text-gray-500">Cargando incidentes...</div>
      ) : incidentes.length === 0 ? (
        <div className="text-center text-gray-500">No se encontraron incidentes</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {incidentes.map((incidente) => (
            <div
              key={`incidente-card-${incidente.idIncidente}`}
              className={`p-4 rounded-lg shadow-lg cursor-pointer transform transition hover:scale-105 ${
                selectedIncidentes.includes(incidente.idIncidente) ? 'border-2 border-blue-500' : ''
              } ${
                incidente.prioridad === 2
                  ? 'bg-red-50'
                  : incidente.prioridad === 1
                  ? 'bg-yellow-50'
                  : 'bg-green-50'
              }`}
              style={{
                minHeight: '250px',
                backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.3))',
                boxShadow: '5px 5px 15px rgba(0,0,0,0.2)',
              }}
              onClick={() => {
                console.log(`Card clicked for incidente ID: ${incidente.idIncidente}`);
                handleSelectIncidente(incidente.idIncidente);
              }}
            >
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-semibold text-gray-800">
                    {incidente.titulo || 'Incidente #' + incidente.idIncidente}
                  </h3>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      incidente.estado === 2
                        ? 'bg-green-100 text-green-800'
                        : incidente.estado === 1
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {getEstadoText(incidente.estado)}
                  </span>
                </div>
                <div className="text-xs text-gray-600 mb-2 flex-grow">
                  <p><strong>Área:</strong> {incidente.area?.nombre?.toUpperCase() || '-'}</p>
                  <p><strong>Activo:</strong> {formatActivo(incidente.activo)}</p>
                  <p><strong>Descripción:</strong> {incidente.descripcion || '-'}</p>
                  <p><strong>Fecha de Reporte:</strong> {formatDate(incidente.fecha_reporte)}</p>
                  <p><strong>Prioridad:</strong> {getPrioridadText(incidente.prioridad)}</p>
                  <p><strong>Técnico:</strong> {formatTecnico(incidente.tecnico)}</p>
                </div>
                <ActionBar
                  incidente={incidente}
                  openEditModal={openEditModal}
                  openDetailsModal={openDetailsModal}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default IncidenteTable;