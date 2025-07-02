import React, { useState, useEffect } from 'react';
import { fetchWithAuth } from '../../../../js/authToken';
import API_BASE_URL from '../../../../js/urlHelper';
import AreaSearch from '../../../../components/ui/Admin/GestionAreasComponents/AreaSearch';
import AreaTable from '../../../../components/ui/Admin/GestionAreasComponents/AreaTable';
import ActionBar from '../../../../components/ui/Admin/GestionAreasComponents/ActionBar';
import EditAreaModal from '../../../../components/ui/Admin/GestionAreasComponents/EditAreaModal';
import AreaDetailsModal from '../../../../components/ui/Admin/GestionAreasComponents/AreaDetailsModal';
import Pagination from '../../../../components/Reutilizables/Pagination';
import { toast } from 'react-toastify';

const AreaManagement = () => {
  const [areas, setAreas] = useState([]);
  const [selectedAreas, setSelectedAreas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [currentArea, setCurrentArea] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(8);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 8,
    total: 0,
    from: 0,
    to: 0,
    has_more_pages: false,
  });
  const [formData, setFormData] = useState({
    nombre: '',
  });
  const [errors, setErrors] = useState({});

  const buildUrlParams = () => {
    const params = new URLSearchParams({
      page: currentPage.toString(),
      per_page: perPage.toString(),
    });
    if (searchTerm.trim()) {
      params.append('search', searchTerm.trim());
    }
    return params.toString();
  };

  useEffect(() => {
    const fetchAreas = async () => {
      setLoading(true);
      try {
        const urlParams = buildUrlParams();
        console.log('Fetching areas with URL:', `${API_BASE_URL}/api/areas?${urlParams}`);
        const response = await fetchWithAuth(`${API_BASE_URL}/api/areas?${urlParams}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        const result = await response.json();
        console.log('Areas API response:', result);

        if (result.success && result.data && Array.isArray(result.data.data)) {
          setAreas(result.data.data);
          setPagination(result.data.pagination || {
            current_page: 1,
            last_page: 1,
            per_page: perPage,
            total: result.data.data.length,
            from: 1,
            to: result.data.data.length,
            has_more_pages: false,
          });
          console.log('Updated pagination state:', result.data.pagination);
        } else {
          console.error('Error fetching areas:', result.message || 'Invalid data format');
          setAreas([]);
          setPagination({
            current_page: 1,
            last_page: 1,
            per_page: perPage,
            total: 0,
            from: 0,
            to: 0,
            has_more_pages: false,
          });
          toast.error('Error al cargar áreas: ' + (result.message || 'Formato de datos inválido'));
        }
      } catch (error) {
        console.error('Error fetching areas:', error.message);
        setAreas([]);
        setPagination({
          current_page: 1,
          last_page: 1,
          per_page: perPage,
          total: 0,
          from: 0,
          to: 0,
          has_more_pages: false,
        });
        toast.error('Error al cargar áreas: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAreas();
  }, [currentPage, perPage, searchTerm]);

  const handleSelectArea = (areaId) => {
    const areaIdStr = String(areaId);
    setSelectedAreas((prev) => {
      const prevStr = prev.map((id) => String(id));
      const isSelected = prevStr.includes(areaIdStr);
      return isSelected ? [] : [areaId];
    });
  };

  const filteredAreas = areas.filter((area) => {
    if (!area.idArea) {
      console.warn('Area with undefined idArea found:', area);
      return false;
    }
    return (area.nombre || '').toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handlePageChange = (page) => {
    console.log('Changing to page:', page);
    setCurrentPage(page);
    setSelectedAreas([]);
  };

  const handlePerPageChange = (newPerPage) => {
    console.log('Changing per page to:', newPerPage);
    setPerPage(newPerPage);
    setCurrentPage(1);
    setSelectedAreas([]);
  };

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
    setSelectedAreas([]);
  };

  const closeDetailsModal = () => {
    setDetailsModalOpen(false);
    setSelectedAreas([]);
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
        <div className="bg-white rounded-lg shadow">
          <AreaTable
            areas={filteredAreas}
            loading={loading}
            selectedAreas={selectedAreas} // Fixed: Pass selectedAreas, not filteredAreas
            handleSelectArea={handleSelectArea}
          />
          <Pagination
            currentPage={pagination.current_page}
            lastPage={pagination.last_page}
            total={pagination.total}
            perPage={pagination.per_page}
            from={pagination.from}
            to={pagination.to}
            hasMorePages={pagination.has_more_pages}
            onPageChange={handlePageChange}
            onPerPageChange={handlePerPageChange}
            loading={loading}
            showPerPageSelector={true}
            perPageOptions={[5, 8, 10, 15, 20, 25]}
          />
        </div>
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
                  const urlParams = buildUrlParams();
                  const response = await fetchWithAuth(`${API_BASE_URL}/api/areas?${urlParams}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                  });
                  const result = await response.json();
                  if (result.success && result.data && Array.isArray(result.data.data)) {
                    setAreas(result.data.data);
                    setPagination(result.data.pagination || {
                      current_page: 1,
                      last_page: 1,
                      per_page: perPage,
                      total: result.data.data.length,
                      from: 1,
                      to: result.data.data.length,
                      has_more_pages: false,
                    });
                  }
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