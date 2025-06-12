import React, { useState, useEffect, useCallback } from 'react';
import { fetchWithAuth } from '../../../../js/authToken';
import API_BASE_URL from '../../../../js/urlHelper';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { X } from 'lucide-react';
import IncidenteTable from '../../../../components/ui/Tecnico/GestionIncidentesComponents/IncidenteTable'; // Adjust the import path as needed
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const IncidentesManagement = () => {
  const [incidentes, setIncidentes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedIncidente, setSelectedIncidente] = useState(null);
  const [selectedIncidentes, setSelectedIncidentes] = useState([]);
  const [formData, setFormData] = useState({
    estado: 2,
    comentarios_tecnico: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchIncidentes = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/api/incidentes?page=${page}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const result = await response.json();
      if (result.success && result.data) {
        setIncidentes(result.data.data || []);
        setCurrentPage(result.data.current_page);
        setTotalPages(result.data.last_page);
      } else {
        setIncidentes([]);
        toast.error('Error al cargar incidentes');
      }
    } catch (error) {
      console.error('Error fetching incidentes:', error.message);
      setIncidentes([]);
      toast.error('Error al cargar incidentes');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIncidentes(currentPage);
  }, [currentPage, fetchIncidentes]);

  const handleSelectIncidente = (idIncidente) => {
    setSelectedIncidentes((prev) =>
      prev.includes(idIncidente)
        ? prev.filter((id) => id !== idIncidente)
        : [...prev, idIncidente]
    );
  };

  const openEditModal = (incidente) => {
    setSelectedIncidente(incidente);
    setFormData({
      estado: 2,
      comentarios_tecnico: incidente.comentarios_tecnico || '',
    });
    setEditModalOpen(true);
  };

  const openDetailsModal = (incidente) => {
    setSelectedIncidente(incidente);
    setDetailsModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setSelectedIncidente(null);
    setFormData({ estado: 2, comentarios_tecnico: '' });
    setErrors({});
  };

  const closeDetailsModal = () => {
    setDetailsModalOpen(false);
    setSelectedIncidente(null);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const payload = {
        estado: 2,
        comentarios_tecnico: formData.comentarios_tecnico || null,
      };

      const response = await fetchWithAuth(
        `${API_BASE_URL}/api/incidentes/${selectedIncidente.idIncidente}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );
      const result = await response.json();
      if (result.success) {
        setIncidentes((prev) =>
          prev.map((inc) =>
            inc.idIncidente === selectedIncidente.idIncidente ? result.data : inc
          )
        );
        closeEditModal();
        toast.success('Incidente actualizado exitosamente');
      } else {
        const apiErrors = result.errors || { general: result.message || 'Error desconocido' };
        setErrors(apiErrors);
        toast.error(`Error: ${apiErrors.general || 'No se pudo actualizar el incidente'}`);
      }
    } catch (error) {
      console.error('Error updating incidente:', error.message);
      setErrors({ general: 'Error de conexión con el servidor' });
      toast.error('Error al actualizar incidente');
    } finally {
      setIsSubmitting(false);
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
    if (!activo) return 'No especificado';
    const parts = [];
    if (activo.codigo_inventario) parts.push(`${activo.codigo_inventario}`);
    if (activo.tipo) parts.push(activo.tipo);
    if (activo.marca_modelo) parts.push(activo.marca_modelo);
    return parts.join(' • ') || 'No especificado';
  };

  const formatTecnico = (tecnico) => {
    if (!tecnico) return 'No asignado';
    return `${tecnico.nombre} ${tecnico.apellido}`;
  };

  const formatUbicacion = (activo) => {
    return activo?.ubicacion || 'No especificada';
  };

  return (
    <div className="min-h-screen py-8 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Gestión de Incidentes
        </h1>

        {/* IncidenteTable Component */}
        <IncidenteTable
          incidentes={incidentes}
          loading={loading}
          selectedIncidentes={selectedIncidentes}
          handleSelectIncidente={handleSelectIncidente}
          openEditModal={openEditModal}
          openDetailsModal={openDetailsModal}
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-between items-center">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 transition-colors"
            >
              Anterior
            </button>
            <span className="text-gray-700 font-medium">
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 transition-colors"
            >
              Siguiente
            </button>
          </div>
        )}

        {/* Edit Modal */}
        {editModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  Editar Incidente #{selectedIncidente?.idIncidente}
                </h2>
                <button
                  onClick={closeEditModal}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={handleEditSubmit}>
                <div className="mb-4">
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    htmlFor="estado"
                  >
                    Estado
                  </label>
                  <select
                    id="estado"
                    value={formData.estado}
                    disabled
                    className="block w-full rounded-lg border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed focus:ring-0 sm:text-sm"
                  >
                    <option value={2}>Resuelto</option>
                  </select>
                  {errors.estado && (
                    <p className="text-red-500 text-xs mt-1">{errors.estado}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    htmlFor="comentarios_tecnico"
                  >
                    Comentarios Técnico
                  </label>
                  <textarea
                    id="comentarios_tecnico"
                    value={formData.comentarios_tecnico}
                    onChange={(e) =>
                      setFormData({ ...formData, comentarios_tecnico: e.target.value })
                    }
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm resize-y"
                    rows="5"
                    placeholder="Describe las acciones realizadas para resolver el incidente"
                  />
                  {errors.comentarios_tecnico && (
                    <p className="text-red-500 text-xs mt-1">{errors.comentarios_tecnico}</p>
                  )}
                </div>
                {errors.general && (
                  <p className="text-red-500 text-sm mb-4">{errors.general}</p>
                )}
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={closeEditModal}
                    className="bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg hover:bg-gray-400"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
                  >
                    {isSubmitting ? 'Guardando...' : 'Guardar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Details Modal */}
        {detailsModalOpen && selectedIncidente && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  Detalles del Incidente #{selectedIncidente.idIncidente}
                </h2>
                <button
                  onClick={closeDetailsModal}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="space-y-4 text-sm text-gray-700">
                <div>
                  <p className="font-medium text-gray-800">Título:</p>
                  <p>{selectedIncidente.titulo || 'Sin título'}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Descripción:</p>
                  <p>{selectedIncidente.descripcion || 'Sin descripción'}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Activo:</p>
                  <p>{formatActivo(selectedIncidente.activo)}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Ubicación:</p>
                  <p>{formatUbicacion(selectedIncidente.activo)}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Área:</p>
                  <p>{selectedIncidente.area?.nombre || 'No especificada'}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Prioridad:</p>
                  <p>
                    {(() => {
                      switch (selectedIncidente.prioridad) {
                        case 0: return 'Baja';
                        case 1: return 'Media';
                        case 2: return 'Alta';
                        default: return 'Desconocida';
                      }
                    })()}
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Fecha de Reporte:</p>
                  <p>{formatDate(selectedIncidente.fecha_reporte)}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Técnico:</p>
                  <p>{formatTecnico(selectedIncidente.tecnico)}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Comentarios Técnico:</p>
                  <p>{selectedIncidente.comentarios_tecnico || 'Sin comentarios'}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Estado:</p>
                  <p>
                    {(() => {
                      switch (selectedIncidente.estado) {
                        case 0: return 'Pendiente';
                        case 1: return 'En progreso';
                        case 2: return 'Resuelto';
                        default: return 'Desconocido';
                      }
                    })()}
                  </p>
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <button
                  onClick={closeDetailsModal}
                  className="bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg hover:bg-gray-400"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IncidentesManagement;