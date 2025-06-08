import React, { useState, useEffect } from 'react';
import { fetchWithAuth } from '../../../../js/authToken';
import API_BASE_URL from '../../../../js/urlHelper';
import AreaSearch from '../../../../components/ui/Admin/GestionAreasComponents/AreaSearch';
import AreaTable from '../../../../components/ui/Admin/GestionAreasComponents/AreaTable';
import ActionBar from '../../../../components/ui/Admin/GestionAreasComponents/ActionBar';
import EditAreaModal from '../../../../components/ui/Admin/GestionAreasComponents/EditAreaModal';
import AreaDetailsModal from '../../../../components/ui/Admin/GestionAreasComponents/AreaDetailsModal';
import { toast } from 'react-toastify';

const AreaManagement = () => {
  const [areas, setAreas] = useState([]);
  const [selectedAreas, setSelectedAreas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [currentArea, setCurrentArea] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchAreas = async () => {
      setLoading(true);
      try {
        const response = await fetchWithAuth(`${API_BASE_URL}/api/areas`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        const result = await response.json();
        if (result.success) {
          setAreas(result.data);
        } else {
          console.error('Error fetching areas:', result.message);
          toast.error('Error fetching areas:', result.message);
        }
      } catch (error) {
        console.error('Error fetching areas:', error);
        toast.error('Error fetching areas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAreas();
  }, []);

  const handleSelectArea = (areaId) => {
    const areaIdStr = String(areaId);
    setSelectedAreas((prev) => {
      const prevStr = prev.map((id) => String(id));
      const isSelected = prevStr.includes(areaIdStr);
      return isSelected ? [] : [areaId]; // Toggle selection: select if not selected, deselect if already selected
    });
  };

  const filteredAreas = areas.filter((area) => {
    if (!area.idArea) {
      console.warn('Area with undefined idArea found:', area);
      return false;
    }
    return (area.nombre || '').toLowerCase().includes(searchTerm.toLowerCase());
  });

  const openEditModal = (area) => {
    setCurrentArea(area);
    setFormData({
      nombre: area.nombre || '',
    });
    setEditModalOpen(true);
  };

  const openDetailsModal = (area) => {
    setCurrentArea(area);
    setDetailsModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setSelectedAreas([]); // Clear selection when closing
  };

  const closeDetailsModal = () => {
    setDetailsModalOpen(false);
    setSelectedAreas([]); // Clear selection when closing
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
          Gestión de Áreas
        </h1>
        <AreaSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <AreaTable
          areas={filteredAreas}
          loading={loading}
          selectedAreas={filteredAreas}
          handleSelectArea={handleSelectArea}
        />
        {selectedAreas.length === 1 && (
          <ActionBar
            area={areas.find((area) => area.idArea === selectedAreas[0])}
            openEditModal={openEditModal}
            openDetailsModal={openDetailsModal}
          />
        )}
        {editModalOpen && (
          <EditAreaModal
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            setErrors={setErrors}
            loading={loading}
            handleEditSubmit={async (e) => {
              e.preventDefault();
              const validateForm = () => {
                const newErrors = {};
                if (!(formData.nombre || '').trim()) newErrors.nombre = 'El nombre del área es requerido';
                setErrors(newErrors);
                return Object.keys(newErrors).length === 0;
              };
              if (!validateForm()) return;
              setLoading(true);
              try {
                const payload = Object.fromEntries(
                  Object.entries(formData).filter(([_, value]) => value !== '' && value !== null)
                );
                const response = await fetchWithAuth(`${API_BASE_URL}/api/areas/${currentArea.idArea}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(payload),
                });
                const result = await response.json();
                if (result.success) {
                  toast.success('Área actualizada exitosamente');
                  setAreas((prev) =>
                    prev.map((area) =>
                      area.idArea === currentArea.idArea ? { ...area, ...result.data } : area
                    )
                  );
                  closeEditModal();
                } else {
                  setErrors(result.errors || { general: result.message });
                  toast.error(`Error: ${result.message}`);
                }
              } catch (error) {
                console.error('Error:', error.message);
                toast.error('Error al actualizar área');
              } finally {
                setLoading(false);
              }
            }}
            setEditModalOpen={closeEditModal}
          />
        )}
        {detailsModalOpen && currentArea && (
          <AreaDetailsModal area={currentArea} setDetailsModalOpen={closeDetailsModal} />
        )}
      </div>
    </div>
  );
};

export default AreaManagement;
