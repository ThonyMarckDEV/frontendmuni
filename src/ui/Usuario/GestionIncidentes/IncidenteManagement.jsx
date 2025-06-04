import React, { useState, useEffect } from 'react';
import { fetchWithAuth } from '../../../js/authToken';
import API_BASE_URL from '../../../js/urlHelper';
import IncidenteTable from '../../../components/ui/Usuario/GestionIncidentesComponents/IncidenteTable';
import ActionBar from '../../../components/ui/Usuario/GestionIncidentesComponents/ActionBar';
import EditIncidenteModal from '../../../components/ui/Usuario/GestionIncidentesComponents/EditIncidenteModal';
import IncidenteDetailsModal from '../../../components/ui/Usuario/GestionIncidentesComponents/IncidenteDetailsModal';

const IncidenteManagement = () => {
  const [incidentes, setIncidentes] = useState([]);
  const [activos, setActivos] = useState([]);
  const [selectedIncidentes, setSelectedIncidentes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingActivos, setLoadingActivos] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [currentIncidente, setCurrentIncidente] = useState(null);
  const [formData, setFormData] = useState({
    activo_id: '',
    descripcion: '',
    fecha_reporte: '',
    prioridad: '0', // Default to Baja
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchIncidentes = async () => {
      setLoading(true);
      try {
        const response = await fetchWithAuth(`${API_BASE_URL}/api/incidentes`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        const result = await response.json();
        if (result.success) {
          setIncidentes(result.data.data);
        } else {
          console.error('Error fetching incidentes:', result.message);
        }
      } catch (error) {
        console.error('Error fetching incidentes:', error);
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
        }
      } catch (error) {
        console.error('Error fetching activos:', error);
      } finally {
        setLoadingActivos(false);
      }
    };

    fetchIncidentes();
    fetchActivos();
  }, []);

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
      activo_id: incidente.activo_id || '',
      descripcion: incidente.descripcion || '',
      fecha_reporte: incidente.fecha_reporte || '',
      prioridad: String(incidente.prioridad) || '0', // Ensure string for form
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
  };

  const closeDetailsModal = () => {
    setDetailsModalOpen(false);
    setSelectedIncidentes([]);
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
        <IncidenteTable
          incidentes={incidentes}
          loading={loading}
          selectedIncidentes={selectedIncidentes}
          handleSelectIncidente={handleSelectIncidente}
        />
        {selectedIncidentes.length === 1 && (
          <ActionBar
            incidente={incidentes.find((incidente) => incidente.id === selectedIncidentes[0])}
            openEditModal={openEditModal}
            openDetailsModal={openDetailsModal}
          />
        )}
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
                if (!formData.activo_id) newErrors.activo_id = 'El activo es requerido';
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
                  activo_id: parseInt(formData.activo_id),
                  descripcion: formData.descripcion,
                  fecha_reporte: formData.fecha_reporte,
                  prioridad: parseInt(formData.prioridad), // Include prioridad
                };
                const response = await fetchWithAuth(`${API_BASE_URL}/api/incidentes/${currentIncidente.id}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(payload),
                });
                const result = await response.json();
                if (result.success) {
                  alert('Incidente actualizado exitosamente');
                  setIncidentes((prev) =>
                    prev.map((incidente) =>
                      incidente.id === currentIncidente.id ? { ...incidente, ...result.data } : incidente
                    )
                  );
                  closeEditModal();
                } else {
                  setErrors(result.errors || { general: result.message });
                  alert(`Error: ${result.message}`);
                }
              } catch (error) {
                console.error('Error:', error.message);
                alert('Error al actualizar incidente');
              } finally {
                setLoading(false);
              }
            }}
            setEditModalOpen={closeEditModal}
            activos={activos}
            loadingActivos={loadingActivos}
          />
        )}
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