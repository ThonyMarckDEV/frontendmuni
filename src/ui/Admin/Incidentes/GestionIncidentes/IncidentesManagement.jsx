import React, { useState, useEffect, useCallback } from 'react';
import { fetchWithAuth } from '../../../../js/authToken';
import API_BASE_URL from '../../../../js/urlHelper';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { X } from 'lucide-react';
import IncidenteTable from '../../../../components/ui/Admin/GestionIncidentesComponents/IncidenteTable';
import IncidenteDetailsModal from '../../../../components/ui/Admin/GestionIncidentesComponents/IncidenteDetailsModal';
import IncidenteFilter from '../../../../components/ui/Admin/GestionIncidentesComponents/IncidenteFilter';

const IncidentesManagement = () => {
  const [incidentes, setIncidentes] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedIncidente, setSelectedIncidente] = useState(null);
  const [selectedIncidentes, setSelectedIncidentes] = useState([]);
  const [formData, setFormData] = useState({
    idTecnico: '',
    estado: 1, // Default to "En progreso"
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filters, setFilters] = useState({
    idIncidente: '',
    estado: '0',
    fecha_inicio: '',
    fecha_fin: '',
  });

  const fetchIncidentes = useCallback(
    async (page = 1, appliedFilters = filters) => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams({ page: page.toString() });
        if (appliedFilters.idIncidente) queryParams.append('idIncidente', appliedFilters.idIncidente);
        if (appliedFilters.estado !== 'all') queryParams.append('estado', appliedFilters.estado);
        if (appliedFilters.fecha_inicio) queryParams.append('fecha_inicio', appliedFilters.fecha_inicio);
        if (appliedFilters.fecha_fin) queryParams.append('fecha_fin', appliedFilters.fecha_fin);

        const response = await fetchWithAuth(`${API_BASE_URL}/api/incidentes?${queryParams.toString()}`, {
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
    },
    [filters]
  );

  const fetchTechnicians = useCallback(async () => {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/api/incidentes/tecnicos`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const result = await response.json();
      if (result.success && Array.isArray(result.data)) {
        setTechnicians(result.data);
      } else {
        setTechnicians([]);
        toast.error('No se encontraron técnicos disponibles');
      }
    } catch (error) {
      console.error('Error fetching technicians:', error.message);
      setTechnicians([]);
      toast.error('Error al cargar técnicos');
    }
  }, []);

  useEffect(() => {
    fetchIncidentes(currentPage, filters);
    fetchTechnicians();
  }, [currentPage, fetchIncidentes, fetchTechnicians]);

  const handleSelectIncidente = (idIncidente) => {
    setSelectedIncidentes((prev) =>
      prev.includes(idIncidente) ? prev.filter((id) => id !== idIncidente) : [...prev, idIncidente]
    );
  };

  const openEditModal = (incidente) => {
    setSelectedIncidente(incidente);
    setFormData({
      idTecnico: incidente.tecnico?.idUsuario || '',
      estado: 1, // Set to "En progreso"
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
    setFormData({ idTecnico: '', estado: 1 });
    setErrors({});
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    const validateForm = () => {
      const newErrors = {};
      if (!formData.idTecnico) newErrors.idTecnico = 'Debe seleccionar un técnico';
      if (formData.estado !== 1) newErrors.estado = 'Estado inválido';
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetchWithAuth(
        `${API_BASE_URL}/api/incidentes/${selectedIncidente.idIncidente}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            idTecnico: formData.idTecnico || null,
            estado: Number(formData.estado),
            idActivo: selectedIncidente.activo?.idActivo,
          }),
        }
      );
      const result = await response.json();
      if (result.success) {
        setIncidentes((prev) =>
          prev.map((inc) => (inc.idIncidente === selectedIncidente.idIncidente ? result.data : inc))
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

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
    fetchIncidentes(1, newFilters);
  };

  const handleClearFilters = (defaultFilters) => {
    setFilters(defaultFilters);
    setCurrentPage(1);
    fetchIncidentes(1, defaultFilters);
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

        <IncidenteFilter onApplyFilters={handleApplyFilters} onClearFilters={handleClearFilters} />

        <IncidenteTable
          incidentes={incidentes}
          loading={loading}
          selectedIncidentes={selectedIncidentes}
          handleSelectIncidente={handleSelectIncidente}
          openEditModal={openEditModal}
          openDetailsModal={openDetailsModal}
          technicians={technicians}
        />

        {totalPages > 1 && (
          <div className="mt-8 flex justify-between items-center">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 transition-colors"
            >
              Anterior
            </button>
            <span className="text-gray-700 font-medium">Página {currentPage} de {totalPages}</span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 transition-colors"
            >
              Siguiente
            </button>
          </div>
        )}

        {editModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  Editar Incidente #{selectedIncidente?.idIncidente}
                </h2>
                <button onClick={closeEditModal} className="text-gray-600 hover:text-gray-800">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={handleEditSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="idTecnico">
                    Técnico
                  </label>
                  <select
                    id="idTecnico"
                    value={formData.idTecnico}
                    onChange={(e) => setFormData({ ...formData, idTecnico: e.target.value })}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    disabled={technicians.length === 0}
                  >
                    <option value="">Seleccione un técnico</option>
                    {technicians.map((tecnico) => (
                      <option key={tecnico.idUsuario} value={tecnico.idUsuario}>
                        {tecnico.nombre} {tecnico.apellido} - Especialidad: {tecnico.especializacion}
                      </option>
                    ))}
                  </select>
                  {errors.idTecnico && <p className="text-red-500 text-xs mt-1">{errors.idTecnico}</p>}
                  {technicians.length === 0 && (
                    <p className="text-yellow-600 text-xs mt-1">No hay técnicos disponibles</p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="estado">
                    Estado
                  </label>
                  <select
                    id="estado"
                    value={formData.estado}
                    onChange={(e) => setFormData({ ...formData, estado: Number(e.target.value) })}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    disabled
                  >
                    <option value={1}>En progreso</option>
                  </select>
                  {errors.estado && <p className="text-red-500 text-xs mt-1">{errors.estado}</p>}
                </div>
                {errors.general && <p className="text-red-500 text-sm mb-4">{errors.general}</p>}
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
                    disabled={isSubmitting || technicians.length === 0}
                    className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
                  >
                    Guardar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {detailsModalOpen && selectedIncidente && (
          <IncidenteDetailsModal incidente={selectedIncidente} setDetailsModalOpen={setDetailsModalOpen} />
        )}
      </div>
    </div>
  );
};

export default IncidentesManagement;