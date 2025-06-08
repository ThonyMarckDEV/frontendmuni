import React, { useState, useEffect, useRef } from 'react';
import { fetchWithAuth } from '../../../../js/authToken';
import API_BASE_URL from '../../../../js/urlHelper';
import AreaSelect from '../../../../components/ui/Admin/GestionActivos-AreasComponents/AreaSelect';
import ActivoAreaTable from '../../../../components/ui/Admin/GestionActivos-AreasComponents/ActivoAreaTable';
import ActionBar from '../../../../components/ui/Admin/GestionActivos-AreasComponents/ActionBar';
import EditActivoAreaModal from '../../../../components/ui/Admin/GestionActivos-AreasComponents/EditActivoAreaModal';
import { X } from 'lucide-react';

const ActivoAreaManagement = () => {
  const [areas, setAreas] = useState([]);
  const [activos, setActivos] = useState([]);
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedActivoArea, setSelectedActivoArea] = useState(null);
  const [assignedActivos, setAssignedActivos] = useState([]);
  const [loadingAreas, setLoadingAreas] = useState(true);
  const [loadingActivos, setLoadingActivos] = useState(true);
  const [loadingAssigned, setLoadingAssigned] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [activoAreaToDelete, setActivoAreaToDelete] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  const [formData, setFormData] = useState({
    idActivo: '',
    idArea: '',
  });
  const [errors, setErrors] = useState({});
  const actionBarRef = useRef(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 3000);
  };

  const fetchAssignedActivos = async () => {
    setLoadingAssigned(true);
    if (!editModalOpen) {
      setSelectedActivoArea(null); // Reset only if modal is not open
    }
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/api/areas/${selectedArea}/activos`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const result = await response.json();
      console.log('Assigned Activos API response:', result);
      if (result.success && Array.isArray(result.data)) {
        const normalizedData = result.data.map((item, index) => ({
          ...item,
          id: item.id || item.idActivoArea || item.idActivo || `temp-id-${index}`,
        }));
        setAssignedActivos(normalizedData);
      } else {
        setAssignedActivos([]);
        console.error('Error fetching assigned activos:', result.message || 'Invalid data format');
        showNotification('Error al cargar activos asignados', 'error');
      }
    } catch (error) {
      console.error('Error fetching assigned activos:', error.message);
      setAssignedActivos([]);
      showNotification('Error al cargar activos asignados', 'error');
    } finally {
      setLoadingAssigned(false);
    }
  };

  useEffect(() => {
    const fetchAreas = async () => {
      setLoadingAreas(true);
      try {
        const response = await fetchWithAuth(`${API_BASE_URL}/api/areas`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        const result = await response.json();
        console.log('Areas API response:', result);
        if (result.success && Array.isArray(result.data)) {
          setAreas(result.data);
        } else {
          setAreas([]);
          console.error('Error fetching areas:', result.message || 'Invalid data format');
          showNotification('Error al cargar áreas', 'error');
        }
      } catch (error) {
        console.error('Error fetching areas:', error.message);
        setAreas([]);
        showNotification('Error al cargar áreas', 'error');
      } finally {
        setLoadingAreas(false);
      }
    };

    const fetchActivos = async () => {
      setLoadingActivos(true);
      try {
        const response = await fetchWithAuth(`${API_BASE_URL}/api/activos`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        const result = await response.json();
        console.log('Activos API response:', result);
        if (result.success && Array.isArray(result.data)) {
          setActivos(result.data);
        } else {
          setActivos([]);
          console.error('Error fetching activos:', result.message || 'Invalid data format');
          showNotification('Error al cargar activos', 'error');
        }
      } catch (error) {
        console.error('Error fetching activos:', error.message);
        setActivos([]);
        showNotification('Error al cargar activos', 'error');
      } finally {
        setLoadingActivos(false);
      }
    };

    fetchAreas();
    fetchActivos();
  }, []);

  useEffect(() => {
    if (selectedArea) {
      fetchAssignedActivos();
    } else {
      setAssignedActivos([]);
      if (!editModalOpen) {
        setSelectedActivoArea(null);
      }
    }
  }, [selectedArea, editModalOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        selectedActivoArea &&
        actionBarRef.current &&
        !actionBarRef.current.contains(event.target) &&
        !event.target.closest('tr') &&
        !editModalOpen
      ) {
        setSelectedActivoArea(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectedActivoArea, editModalOpen]);

  const handleSelectActivoArea = (activoAreaId) => {
    setSelectedActivoArea((prev) => (prev === activoAreaId ? null : activoAreaId));
  };

  const openEditModal = (activoArea) => {
    setFormData({
      idActivo: activoArea.idActivo || '',
      idArea: activoArea.idArea || '',
    });
    setEditModalOpen(true);
    setSelectedActivoArea(activoArea.id || activoArea.idActivoArea);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setSelectedActivoArea(null);
    setFormData({ idActivo: '', idArea: '' });
    setErrors({});
  };

  const handleDelete = async () => {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/api/activos-areas/${activoAreaToDelete}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      const result = await response.json();
      if (result.success) {
        showNotification('Asignación eliminada exitosamente');
        setAssignedActivos(assignedActivos.filter((aa) => (aa.id || aa.idActivoArea) !== activoAreaToDelete));
        setSelectedActivoArea(null);
        if (selectedArea) {
          await fetchAssignedActivos(); // Refresh data after delete
        }
      } else {
        showNotification(`Error: ${result.message}`, 'error');
      }
    } catch (error) {
      console.error('Error:', error.message);
      showNotification('Error al eliminar asignación', 'error');
    } finally {
      setConfirmDeleteOpen(false);
      setActivoAreaToDelete(null);
    }
  };

  const openConfirmDelete = (activoAreaId) => {
    setActivoAreaToDelete(activoAreaId);
    setConfirmDeleteOpen(true);
  };

  return (
    <div className="min-h-screen py-8 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h-4m-6 0H5a2 2 0 001 1.732V23m12-1.268A2 2 0 0019 23v-2"
            />
          </svg>
          Gestión de Activos por Área
        </h1>
        <AreaSelect
          selectedArea={selectedArea}
          setSelectedArea={setSelectedArea}
          areas={areas}
          loadingAreas={loadingAreas}
        />
        <ActivoAreaTable
          assignedActivos={assignedActivos}
          loadingAssigned={loadingAssigned}
          selectedActivoArea={selectedActivoArea}
          handleSelectActivoArea={handleSelectActivoArea}
        />
        {selectedActivoArea && assignedActivos.some((aa) => (aa.id || aa.idActivoArea) === selectedActivoArea) && (
          <div ref={actionBarRef}>
            <ActionBar
              activoArea={assignedActivos.find((aa) => (aa.id || aa.idActivoArea) === selectedActivoArea)}
              openEditModal={openEditModal}
              handleDelete={openConfirmDelete}
            />
          </div>
        )}
        {editModalOpen && (
          <EditActivoAreaModal
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            setErrors={setErrors}
            areas={areas}
            activos={activos}
            loadingAreas={loadingAreas}
            loadingActivos={loadingActivos}
            activoAreaId={selectedActivoArea}
            handleEditSubmit={async (e, activoAreaId) => {
              e.preventDefault();
              const validateForm = () => {
                const newErrors = {};
                if (!formData.idActivo) newErrors.idActivo = 'Debe seleccionar un activo';
                if (!formData.idArea) newErrors.idArea = 'Debe seleccionar un área';
                setErrors(newErrors);
                return Object.keys(newErrors).length === 0;
              };
              if (!validateForm()) return;
              if (!activoAreaId) {
                showNotification('Error: No se seleccionó un activo válido', 'error');
                return;
              }
              try {
                const response = await fetchWithAuth(
                  `${API_BASE_URL}/api/activos-areas/${activoAreaId}`,
                  {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                  }
                );
                const result = await response.json();
                if (result.success) {
                  showNotification('Asignación actualizada exitosamente');
                  // Immediate state update for feedback
                  const updatedActivo = {
                    ...result.data,
                    id: result.data.id || result.data.idActivoArea,
                    codigo_inventario: activos.find((a) => a.idActivo === result.data.idActivo)?.codigo_inventario || '',
                    tipo: activos.find((a) => a.idActivo === result.data.idActivo)?.tipo || '',
                    marca_modelo: activos.find((a) => a.idActivo === result.data.idActivo)?.marca_modelo || '',
                    estado: activos.find((a) => a.idActivo === result.data.idActivo)?.estado || true,
                    idArea: result.data.idArea,
                  };
                  setAssignedActivos((prev) =>
                    prev.map((aa) =>
                      (aa.id || aa.idActivoArea) === activoAreaId ? updatedActivo : aa
                    )
                  );
                  // Refresh data from backend
                  if (selectedArea) {
                    await fetchAssignedActivos();
                  }
                  closeEditModal();
                } else {
                  setErrors(result.errors || { general: result.message });
                  showNotification(`Error: ${result.message}`, 'error');
                }
              } catch (error) {
                console.error('Error:', error.message);
                showNotification('Error al actualizar asignación', 'error');
              }
            }}
            setEditModalOpen={setEditModalOpen}
          />
        )}
        {confirmDeleteOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Confirmar Eliminación</h2>
                <button
                  onClick={() => setConfirmDeleteOpen(false)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <p className="text-gray-600 mb-6">
                ¿Estás seguro de que deseas eliminar esta asignación?
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setConfirmDeleteOpen(false)}
                  className="bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg hover:bg-gray-400"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-700"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        )}
        {notification.show && (
          <div
            className={`fixed top-4 right-4 ${
              notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'
            } text-white px-4 py-2 rounded-lg shadow-lg z-50`}
          >
            {notification.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivoAreaManagement;