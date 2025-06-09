import React, { useState, useEffect, useRef } from 'react';
import { fetchWithAuth } from '../../../../js/authToken';
import API_BASE_URL from '../../../../js/urlHelper';
import AreaSelect from '../../../../components/ui/Admin/GestionActivos-AreasComponents/AreaSelect';
import ActivoAreaTable from '../../../../components/ui/Admin/GestionActivos-AreasComponents/ActivoAreaTable';
import ActionBar from '../../../../components/ui/Admin/GestionActivos-AreasComponents/ActionBar';
import EditActivoAreaModal from '../../../../components/ui/Admin/GestionActivos-AreasComponents/EditActivoAreaModal';
import { X } from 'lucide-react';
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';

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
  const [formData, setFormData] = useState({
    idActivo: '',
    idArea: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false); // Prevent multiple submissions
  const actionBarRef = useRef(null);

  const fetchAssignedActivos = async () => {
    setLoadingAssigned(true);
    if (!editModalOpen) {
      setSelectedActivoArea(null);
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
          id: item.idActivoArea || `temp-${index}`,
        }));
        setAssignedActivos(normalizedData);
      } else {
        setAssignedActivos([]);
        console.error('Error fetching assigned activos:', result.message || 'Invalid data format');
        toast.error('Error al cargar activos asignados');
      }
    } catch (error) {
      console.error('Error fetching assigned activos:', error.message);
      setAssignedActivos([]);
      toast.error('Error al cargar activos asignados');
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
          if (!toast.isActive('areas-error')) {
            toast.error('Error al cargar áreas');
          }
        }
      } catch (error) {
        console.error('Error fetching areas:', error.message);
        setAreas([]);
        toast.error('Error al cargar áreas');
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
          toast.error('Error al cargar activos');
        }
      } catch (error) {
        console.error('Error fetching activos:', error.message);
        setActivos([]);
        toast.error('Error al cargar activos');
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
    setSelectedActivoArea(activoArea.idActivoArea);
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
        toast.success('Asignación eliminada exitosamente');
        setAssignedActivos(assignedActivos.filter((aa) => aa.idActivoArea !== activoAreaToDelete));
        setSelectedActivoArea(null);
        if (selectedArea) {
          await fetchAssignedActivos();
        }
      } else {
        toast.error(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Error:', error.message);
      toast.error('Error al eliminar asignación');
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
      <ToastContainer />
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
        {selectedActivoArea && assignedActivos.some((aa) => aa.idActivoArea === selectedActivoArea) && (
          <div ref={actionBarRef}>
            <ActionBar
              activoArea={assignedActivos.find((aa) => aa.idActivoArea === selectedActivoArea)}
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
              if (isSubmitting) return; // Prevent multiple submissions
              setIsSubmitting(true);
              const validateForm = () => {
                const newErrors = {};
                if (!formData.idActivo) newErrors.idActivo = 'Debe seleccionar un activo';
                if (!formData.idArea) newErrors.idArea = 'Debe seleccionar un área';
                setErrors(newErrors);
                return Object.keys(newErrors).length === 0;
              };
              if (!validateForm()) {
                setIsSubmitting(false);
                return;
              }
              if (!activoAreaId) {
                toast.error('Error: No se seleccionó un activo válido');
                setIsSubmitting(false);
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
                  const updatedActivo = {
                    ...result.data,
                    idActivoArea: result.data.id,
                    id: result.data.id,
                    idActivo: result.data.idActivo,
                    idArea: result.data.idArea,
                    codigo_inventario: activos.find((a) => a.idActivo === result.data.idActivo)?.codigo_inventario || '',
                    tipo: activos.find((a) => a.idActivo === result.data.idActivo)?.tipo || '',
                    marca_modelo: activos.find((a) => a.idActivo === result.data.idActivo)?.marca_modelo || '',
                    estado: activos.find((a) => a.idActivo === result.data.idActivo)?.estado || true,
                    area: areas.find((a) => a.idArea === result.data.idArea) || { idArea: result.data.idArea, nombre: '' },
                  };
                  setAssignedActivos((prev) =>
                    prev.map((aa) => (aa.idActivoArea === activoAreaId ? updatedActivo : aa))
                  );
                  if (selectedArea) {
                    await fetchAssignedActivos();
                  }
                  toast.success('Asignación actualizada exitosamente');
                  closeEditModal();
                } else {
                  setErrors(result.errors || { general: result.message });
                  toast.error(`Error: ${result.message}`);
                }
              } catch (error) {
                console.error('Error:', error.message);
                toast.error('Error al actualizar asignación');
              } finally {
                setIsSubmitting(false);
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
      </div>
    </div>
  );
};

export default ActivoAreaManagement;