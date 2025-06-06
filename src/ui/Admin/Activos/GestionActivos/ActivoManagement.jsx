import React, { useState, useEffect } from 'react';
import { fetchWithAuth } from '../../../../js/authToken';
import API_BASE_URL from '../../../../js/urlHelper';
import ActivoTable from '../../../../components/ui/Admin/GestionActivosComponents/ActivoTable';
import ActionBar from '../../../../components/ui/Admin/GestionActivosComponents/ActionBar';
import EditActivoModal from '../../../../components/ui/Admin/GestionActivosComponents/EditActivoModal';
import ActivoDetailsModal from '../../../../components/ui/Admin/GestionActivosComponents/ActivoDetailsModal';

const ActivoManagement = () => {
  const [activos, setActivos] = useState([]);
  const [selectedActivos, setSelectedActivos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [currentActivo, setCurrentActivo] = useState(null);
  const [formData, setFormData] = useState({
    codigo_inventario: '',
    ubicacion: '',
    tipo: '',
    marca_modelo: '',
    estado: 1,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchActivos = async () => {
      setLoading(true);
      try {
        const response = await fetchWithAuth(`${API_BASE_URL}/api/activos`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        const result = await response.json();
        console.log('Activos API response:', result); // Debug log
        if (result.success && Array.isArray(result.data)) {
          // Normalize idActivo to id
          const normalizedActivos = result.data.map((activo) => ({
            ...activo,
            id: activo.idActivo,
          }));
          setActivos(normalizedActivos);
        } else {
          setActivos([]);
          console.error('Error fetching activos:', result.message || 'Invalid data format');
          alert('Error al cargar activos');
        }
      } catch (error) {
        console.error('Error fetching activos:', error.message);
        setActivos([]);
        alert('Error al cargar activos');
      } finally {
        setLoading(false);
      }
    };

    fetchActivos();
  }, []);

  const handleSelectActivo = (activoId) => {
    const activoIdStr = String(activoId);
    setSelectedActivos((prev) => {
      const prevStr = prev.map((id) => String(id));
      const isSelected = prevStr.includes(activoIdStr);
      return isSelected ? [] : [activoId];
    });
  };

  const openEditModal = (activo) => {
    setCurrentActivo(activo);
    setFormData({
      codigo_inventario: activo.codigo_inventario || '',
      ubicacion: activo.ubicacion || '',
      tipo: activo.tipo || '',
      marca_modelo: activo.marca_modelo || '',
      estado: activo.estado ? 1 : 0,
    });
    setEditModalOpen(true);
  };

  const openDetailsModal = (activo) => {
    setCurrentActivo(activo);
    setDetailsModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setSelectedActivos([]);
  };

  const closeDetailsModal = () => {
    setDetailsModalOpen(false);
    setSelectedActivos([]);
  };

  return (
    <div className="min-h-screen py-8 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke="default" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6h12m0 0l-4-4m4 4l-4 4m-18-2h12m0 0l-4-4m4 4l-4 4" />
          </svg>
          Gestión de Activos
        </h1>
        <ActivoTable
          activos={activos}
          loading={loading}
          selectedActivos={selectedActivos}
          handleSelectActivo={handleSelectActivo}
        />
        {selectedActivos.length === 1 && (
          <ActionBar
            activo={activos.find((activo) => activo.id === selectedActivos[0] || activo.idActivo === selectedActivos[0])}
            openEditModal={openEditModal}
            openDetailsModal={openDetailsModal}
          />
        )}
        {editModalOpen && (
          <EditActivoModal
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            setErrors={setErrors}
            loading={loading}
            handleEditSubmit={async (e) => {
              e.preventDefault();
              const validateForm = () => {
                const newErrors = {};
                if (!(formData.codigo_inventario || '').trim()) newErrors.codigo_inventario = 'El código de inventario es requerido';
                if (!(formData.ubicacion || '').trim()) newErrors.ubicacion = 'La ubicación es requerida';
                if (!(formData.tipo || '').trim()) newErrors.tipo = 'El tipo es requerido';
                if (!(formData.marca_modelo || '').trim()) newErrors.marca_modelo = 'La marca/modelo es requerida';
                setErrors(newErrors);
                return Object.keys(newErrors).length === 0;
              };
              if (!validateForm()) return;
              setLoading(true);
              try {
                const payload = Object.fromEntries(
                  Object.entries(formData).filter(([_, value]) => value !== '' && value !== null)
                );
                const response = await fetchWithAuth(`${API_BASE_URL}/api/activos/${currentActivo.id || currentActivo.idActivo}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(payload),
                });
                const result = await response.json();
                if (result.success) {
                  alert('Activo actualizado exitosamente');
                  setActivos((prev) =>
                    prev.map((activo) =>
                      (activo.id || activo.idActivo) === (currentActivo.id || currentActivo.idActivo) ? { ...activo, ...result.data, id: result.data.idActivo } : activo
                    )
                  );
                  closeEditModal();
                } else {
                  setErrors(result.errors || { general: result.message });
                  alert(`Error: ${result.message}`);
                }
              } catch (error) {
                console.error('Error:', error.message);
                alert('Error al actualizar activo');
              } finally {
                setLoading(false);
              }
            }}
            setEditModalOpen={closeEditModal}
          />
        )}
        {detailsModalOpen && currentActivo && (
          <ActivoDetailsModal
            activo={currentActivo}
            setDetailsModalOpen={closeDetailsModal}
          />
        )}
      </div>
    </div>
  );
};

export default ActivoManagement;
