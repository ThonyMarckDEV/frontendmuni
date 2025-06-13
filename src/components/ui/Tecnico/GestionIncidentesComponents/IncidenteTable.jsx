import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { AlertCircle, Clock, CheckCircle2, User, MapPin, Edit, Eye } from 'lucide-react';

const IncidenteTable = ({ incidentes, loading, selectedIncidentes, handleSelectIncidente, openEditModal, openDetailsModal }) => {
  const getEstadoConfig = (estado) => {
    switch (estado) {
      case 0:
        return {
          text: 'Pendiente',
          icon: AlertCircle,
          bgColor: 'bg-amber-100',
          textColor: 'text-amber-800',
          borderColor: 'border-amber-200',
        };
      case 1:
        return {
          text: 'En Progreso',
          icon: Clock,
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-800',
          borderColor: 'border-blue-200',
        };
      case 2:
        return {
          text: 'Resuelto',
          icon: CheckCircle2,
          bgColor: 'bg-emerald-100',
          textColor: 'text-emerald-800',
          borderColor: 'border-emerald-200',
        };
      default:
        return {
          text: 'Desconocido',
          icon: AlertCircle,
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          borderColor: 'border-gray-200',
        };
    }
  };

  const getPrioridadConfig = (prioridad) => {
    switch (prioridad) {
      case 0:
        return {
          text: 'Baja',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          accentColor: 'bg-green-500',
        };
      case 1:
        return {
          text: 'Media',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          accentColor: 'bg-yellow-500',
        };
      case 2:
        return {
          text: 'Alta',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          accentColor: 'bg-red-500',
        };
      default:
        return {
          text: 'Desconocida',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          accentColor: 'bg-gray-500',
        };
    }
  };

  const formatDate = (date) => {
    try {
      return format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: es });
    } catch {
      return 'Fecha no disponible';
    }
  };

  const formatActivo = (activo) => {
    if (!activo) return 'No especificado';
    const parts = [];
    if (activo.codigo_inventario) parts.push(`${activo.codigo_inventario}`);
    if (activo.tipo) parts.push(activo.tipo);
    if (activo.marca_modelo) parts.push(activo.marca_modelo);
    return parts.join(' • ') || 'No especificado';
  };

  const formatTecnico = (tecnico) => {
    if (!tecnico) return 'No asignado';
    return `${tecnico.nombre || ''} ${tecnico.apellido || ''}`.trim() || 'No asignado';
  };

  const formatUbicacion = (activo) => {
    return activo?.ubicacion || 'No especificada';
  };

  const formatComentariosTecnico = (comentarios) => {
    return comentarios ? comentarios : 'Sin comentarios';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-3"></div>
          <p className="text-gray-600 font-medium">Cargando incidentes...</p>
        </div>
      </div>
    );
  }

  if (!incidentes || incidentes.length === 0) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-gray-600 font-medium text-lg">No se encontraron incidentes</p>
        <p className="text-gray-500 text-sm mt-1">Los incidentes aparecerán aquí cuando estén disponibles</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {incidentes.map((incidente) => {
          const estadoConfig = getEstadoConfig(incidente.estado);
          const prioridadConfig = getPrioridadConfig(incidente.prioridad);
          const EstadoIcon = estadoConfig.icon;

          return (
            <div
              key={`incidente-card-${incidente.idIncidente}`}
              className={`
                relative bg-white rounded-xl border-2 transition-all duration-300 cursor-pointer hover:shadow-xl hover:-translate-y-1 w-full
                ${selectedIncidentes.includes(incidente.idIncidente)
                  ? 'border-indigo-500 shadow-lg ring-2 ring-indigo-200'
                  : `${prioridadConfig.borderColor} hover:border-indigo-300`
                }
                ${prioridadConfig.bgColor}
              `}
              onClick={() => {
                console.log(`Card clicked for incidente ID: ${incidente.idIncidente}`);
                handleSelectIncidente(incidente.idIncidente);
              }}
            >
              {/* Indicador de prioridad */}
              <div className={`absolute top-0 left-0 w-full h-1 ${prioridadConfig.accentColor} rounded-t-xl`}></div>

              <div className="p-6 flex flex-col h-full min-h-[380px]">
                {/* Header */}
                <div className="flex items-start justify-between mb-5">
                  <div className="flex-1 min-w-0 pr-4">
                    <h3 className="text-base font-semibold text-gray-900 mb-1 truncate">
                      {incidente.titulo || `Incidente #${incidente.idIncidente}`}
                    </h3>
                    <p className="text-sm text-gray-600 font-medium">
                      ID: {incidente.idIncidente}
                    </p>
                  </div>
                  <div
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium ${estadoConfig.bgColor} ${estadoConfig.textColor} border ${estadoConfig.borderColor} flex-shrink-0`}
                  >
                    <EstadoIcon size={12} />
                    <span>{estadoConfig.text}</span>
                  </div>
                </div>

                {/* Contenido principal */}
                <div className="flex-1 space-y-4 text-sm text-gray-700">
                  <div className="bg-white/60 rounded-lg p-4 space-y-2">
                    <div className="flex items-start gap-3">
                      <MapPin size={14} className="text-gray-500 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="font-medium text-gray-800">
                          {incidente.area?.nombre?.toUpperCase() || 'ÁREA NO ESPECIFICADA'}
                        </p>
                        <p className="text-gray-600 text-sm">{formatUbicacion(incidente.activo)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="font-medium text-gray-800 mb-2">Activo:</p>
                      <p className="text-gray-600 text-sm leading-relaxed">{formatActivo(incidente.activo)}</p>
                    </div>

                    {incidente.descripcion && (
                      <div>
                        <p className="font-medium text-gray-800 mb-2">Descripción:</p>
                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">{incidente.descripcion}</p>
                      </div>
                    )}

                    {incidente.comentarios_tecnico && (
                      <div>
                        <p className="font-medium text-gray-800 mb-2">Comentarios Técnico:</p>
                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">{formatComentariosTecnico(incidente.comentarios_tecnico)}</p>
                      </div>
                    )}

                    <div className=":grid grid-cols-1 gap-3 pt-3 border-t border-gray-200">
                      <div className="flex items-center gap-3">
                        <Clock size={14} className="text-gray-400" />
                        <span className="text-gray-600 text-sm">{formatDate(incidente.fecha_reporte)}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <User size={14} className="text-gray-400" />
                        <span className="text-gray-600 text-sm">{formatTecnico(incidente.tecnico)}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 text-sm">Prioridad:</span>
                        <span
                          className={`px-3 py-1.5 rounded-full text-xs font-medium ${prioridadConfig.bgColor} ${prioridadConfig.textColor} border ${prioridadConfig.borderColor}`}
                        >
                          {prioridadConfig.text}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Bar */}
                <div className="flex flex-col sm:flex-row gap-3 mt-auto pt-4 border-t border-gray-200">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditModal(incidente);
                    }}
                    disabled={incidente.estado === 2}
                    className={`flex items-center justify-center gap-2 text-white text-sm font-medium py-3 px-4 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex-1 ${
                      incidente.estado === 2 ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
                    }`}
                  >
                    <Edit size={16} />
                    <span>Editar</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openDetailsModal(incidente);
                    }}
                    className="flex items-center justify-center gap-2 bg-slate-600 hover:bg-slate-700 text-white text-sm font-medium py-3 px-4 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 flex-1"
                  >
                    <Eye size={16} />
                    <span>Detalles</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default IncidenteTable;