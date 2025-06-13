import React, { useState, useEffect } from 'react';
import { fetchWithAuth } from '../../../../js/authToken';
import API_BASE_URL from '../../../../js/urlHelper';
import IncidenteTable from '../../../../components/ui/Usuario/GestionIncidentesComponents/IncidenteTable';
import EditIncidenteModal from '../../../../components/ui/Usuario/GestionIncidentesComponents/EditIncidenteModal';
import IncidenteDetailsModal from '../../../../components/ui/Usuario/GestionIncidentesComponents/IncidenteDetailsModal';
import IncidenteFilter from '../../../../components/ui/Usuario/GestionIncidentesComponents/IncidenteFilter'; // New import
import { toast } from 'react-toastify';

const IncidenteManagement = () => {
  const [incidentes, setIncidentes] = useState([]);
  const [activos, setActivos] = useState([]);
  const [selectedIncidentes, setSelectedIncidentes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingActivos, setLoadingActivos] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [currentIncidente, setCurrentIncidente] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Added for pagination
  const [totalPages, setTotalPages] = useState(1); // Added for pagination
  const [filters, setFilters] = useState({
    idIncidente: '',
    estado: '0', // Default to Pendiente
    fecha_inicio: '',
    fecha_fin: '',
  });
  const [formData, setFormData] = useState({
    idActivo: '',
    descripcion: '',
    fecha_reporte: '',
    prioridad: '0',
  });
  const [errors, setErrors] = useState({});

  const fetchIncidentes = async (page = 1, appliedFilters = filters) => {
    setLoading(true);
    try {
      // Build query parameters
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
        toast.error(result.message || 'Error al cargar incidentes');
      }
    } catch (error) {
      console.error('Error fetching incidentes:', error.message);
      toast.error('Error al cargar incidentes');
    } finally {
      setLoading(false);
    }
  };

  const fetchActivos = async () => {
    setLoadingActivos(true);
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/api/incidentes/getactivos`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const result = await response.json();
      if (result.success) {
        setActivos(result.data);
      } else {
        console.error('Error fetching activos:', result.message);
        toast.error(result.message || 'Error al cargar activos');
      }
    } catch (error) {
      console.error('Error fetching activos:', error.message);
      toast.error('Error al cargar activos');
    } finally {
      setLoadingActivos(false);
    }
  };

  useEffect(() => {
    fetchIncidentes(currentPage, filters);
    fetchActivos();
  }, [currentPage, filters]);

  const handleSelectIncidente = (incidenteId) => {
    const incidenteIdStr = String(incidenteId);
    setSelectedIncidentes((prev) => {
      const prevStr = prev.map((id) => String(id));
      const isSelected = prevStr.includes(incidenteIdStr);
      return isSelected ? [] : [incidenteId];
    });
  };

  const openEditModal = (incidente) => {
    setCurrentIncidente(incidente);
    setFormData({
      idActivo: incidente.activo?.idActivo || '',
      descripcion: incidente.descripcion || '',
      fecha_reporte: incidente.fecha_reporte?.split(' ')[0] || '', // Format to YYYY-MM-DD
      prioridad: String(incidente.prioridad) || '0',
    });
    setEditModalOpen(true);
  };

  const openDetailsModal = (incidente) => {
    setCurrentIncidente(incidente);
    setDetailsModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setSelectedIncidentes([]);
    setFormData({
      idActivo: '',
      descripcion: '',
      fecha_reporte: '',
      prioridad: '0',
    });
    setErrors({});
  };

  const closeDetailsModal = () => {
    setDetailsModalOpen(false);
    setSelectedIncidentes([]);
  };

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when applying filters
    fetchIncidentes(1, newFilters);
  };

  const handleClearFilters = (defaultFilters) => {
    setFilters(defaultFilters);
    setCurrentPage(1); // Reset to first page when clearing filters
    fetchIncidentes(1, defaultFilters);
  };

  return (
    <div className="min-h-screen py-8 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Gestión de Incidentes
        </h1>

        {/* IncidenteFilter Component */}
        <IncidenteFilter onApplyFilters={handleApplyFilters} onClearFilters={handleClearFilters} />

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
          <EditIncidenteModal
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            setErrors={setErrors}
            loading={loading}
            handleEditSubmit={async (e) => {
              e.preventDefault();
              const validateForm = () => {
                const newErrors = {};
                if (!formData.idActivo) newErrors.idActivo = 'El activo es requerido';
                if (!(formData.descripcion || '').trim()) newErrors.descripcion = 'La descripción es requerida';
                if (!(formData.fecha_reporte || '').trim()) newErrors.fecha_reporte = 'La fecha de reporte es requerida';
                if (!['0', '1', '2'].includes(formData.prioridad)) newErrors.prioridad = 'La prioridad es requerida';
                setErrors(newErrors);
                return Object.keys(newErrors).length === 0;
              };
              if (!validateForm()) return;
              setLoading(true);
              try {
                const payload = {
                  idActivo: parseInt(formData.idActivo),
                  descripcion: formData.descripcion,
                  fecha_reporte: formData.fecha_reporte,
                  prioridad: parseInt(formData.prioridad),
                };
                const response = await fetchWithAuth(`${API_BASE_URL}/api/incidentes/${currentIncidente.idIncidente}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(payload),
                });
                const result = await response.json();
                if (result.success) {
                  toast.success('Incidente actualizado exitosamente');
                  setIncidentes((prev) =>
                    prev.map((incidente) =>
                      incidente.idIncidente === currentIncidente.idIncidente ? { ...incidente, ...result.data } : incidente
                    )
                  );
                  closeEditModal();
                } else {
                  setErrors(result.errors || { general: result.message });
                  toast.error(`Error: ${result.message}`);
                }
              } catch (error) {
                console.error('Error:', error.message);
                toast.error('Error al actualizar incidente');
              } finally {
                setLoading(false);
              }
            }}
            setEditModalOpen={closeEditModal}
            activos={activos}
            loadingActivos={loadingActivos}
          />
        )}

        {/* Details Modal */}
        {detailsModalOpen && currentIncidente && (
          <IncidenteDetailsModal
            incidente={currentIncidente}
            setDetailsModalOpen={closeDetailsModal}
          />
        )}
      </div>
    </div>
  );
};

export default IncidenteManagement;