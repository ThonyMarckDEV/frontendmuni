import React, { useState, useEffect, useCallback } from 'react';
import { fetchWithAuth } from '../../../../js/authToken';
import API_BASE_URL from '../../../../js/urlHelper';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Pencil, X, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const IncidentesManagement = () => {
  const [incidentes, setIncidentes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedIncidente, setSelectedIncidente] = useState(null);
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

  const handleEdit = (incidente) => {
    setSelectedIncidente(incidente);
    setFormData({
      estado: 2,
      comentarios_tecnico: incidente.comentarios_tecnico || '',
    });
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setSelectedIncidente(null);
    setFormData({ estado: 2, comentarios_tecnico: '' });
    setErrors({});
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

  const priorityLabel = (prioridad) => {
    switch (prioridad) {
      case 0: return 'Baja';
      case 1: return 'Media';
      case 2: return 'Alta';
      default: return 'Desconocida';
    }
  };

  const priorityColor = (prioridad) => {
    switch (prioridad) {
      case 0: return 'bg-green-100 border-green-300';
      case 1: return 'bg-yellow-100 border-yellow-300';
      case 2: return 'bg-red-100 border-red-300';
      default: return 'bg-gray-100 border-gray-300';
    }
  };

  const stateLabel = (estado) => {
    switch (estado) {
      case 0: return 'Pendiente';
      case 1: return 'En progreso';
      case 2: return 'Resuelto';
      default: return 'Desconocido';
    }
  };

  const stateBadge = (estado) => {
    switch (estado) {
      case 0: return 'bg-gray-500';
      case 1: return 'bg-blue-500';
      case 2: return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen py-6 px-4 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-gray-900 mb-8 flex items-center gap-3"
        >
          <AlertTriangle className="w-8 h-8 text-orange-500" />
          Gestión de Incidentes
        </motion.h1>

        {/* Incidentes Grid */}
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-600 text-lg"
          >
            Cargando incidentes...
          </motion.div>
        ) : incidentes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-600 text-lg"
          >
            No hay incidentes asignados
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <AnimatePresence>
              {incidentes.map((incidente) => (
                <motion.div
                  key={incidente.idIncidente}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`p-6 rounded-xl shadow-lg border-2 ${priorityColor(
                    incidente.prioridad
                  )} transform transition-transform hover:scale-105`}
                >
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-semibold text-gray-600">
                      #{incidente.idIncidente}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium text-white ${stateBadge(
                        incidente.estado
                      )}`}
                    >
                      {stateLabel(incidente.estado)}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {incidente.titulo}
                  </h3>
                  <p className="text-gray-800 text-base mb-4 font-medium leading-relaxed">
                    {incidente.descripcion}
                  </p>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>
                      <span className="font-medium">Activo:</span>{' '}
                      {incidente.activo
                        ? `${incidente.activo.codigo_inventario} (${incidente.activo.tipo})`
                        : '-'}
                    </p>
                    <p>
                      <span className="font-medium">Ubicación:</span>{' '}
                      {incidente.activo?.ubicacion || '-'}
                    </p>
                    <p>
                      <span className="font-medium">Área:</span>{' '}
                      {incidente.area?.nombre || '-'}
                    </p>
                    <p>
                      <span className="font-medium">Prioridad:</span>{' '}
                      {priorityLabel(incidente.prioridad)}
                    </p>
                    <p>
                      <span className="font-medium">Fecha Reporte:</span>{' '}
                      {new Date(incidente.fecha_reporte).toLocaleDateString('es-ES')}
                    </p>
                    <p>
                      <span className="font-medium">Comentarios Técnico:</span>{' '}
                      {incidente.comentarios_tecnico || '-'}
                    </p>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => handleEdit(incidente)}
                      className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                      title="Editar"
                      disabled={incidente.estado === 2}
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 flex justify-between items-center"
          >
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
          </motion.div>
        )}

        {/* Edit Modal */}
        {editModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Editar Incidente #{selectedIncidente?.idIncidente}
                </h2>
                <button
                  onClick={closeEditModal}
                  className="p-1 rounded-full text-gray-600 hover:bg-gray-200 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={handleEditSubmit}>
                <div className="mb-6">
                  <label
                    className="block text-sm font-medium text-gray-700 mb-2"
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
                <div className="mb-6">
                  <label
                    className="block text-sm font-medium text-gray-700 mb-2"
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
                  <p className="text-red-500 text-sm mb-6">{errors.general}</p>
                )}
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={closeEditModal}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
                  >
                    {isSubmitting ? 'Guardando...' : 'Guardar'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default IncidentesManagement;
