import React, { useState, useEffect } from 'react';
import { fetchWithAuth } from '../../../../js/authToken';
import API_BASE_URL from '../../../../js/urlHelper';
import ActivoTable from '../../../../components/ui/Admin/GestionActivosComponents/ActivoTable';
import ActionBar from '../../../../components/ui/Admin/GestionActivosComponents/ActionBar';
import EditActivoModal from '../../../../components/ui/Admin/GestionActivosComponents/EditActivoModal';
import ActivoDetailsModal from '../../../../components/ui/Admin/GestionActivosComponents/ActivoDetailsModal';
import Pagination from '../../../../components/Reutilizables/Pagination';
import { toast } from 'react-toastify';

const ActivoManagement = () => {
  const [activos, setActivos] = useState([]);
  const [selectedActivos, setSelectedActivos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [currentActivo, setCurrentActivo] = useState(null);
  // Estados para paginación
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
  // Estado para el formulario de edición
  const [formData, setFormData] = useState({
    codigo_inventario: '',
    ubicacion: '',
    tipo: '',
    marca_modelo: '',
    estado: 1,
  });
  const [errors, setErrors] = useState({});

  // Función para construir parámetros de URL
  const buildUrlParams = () => {
    const params = new URLSearchParams({
      page: currentPage.toString(),
      per_page: perPage.toString(),
    });
    return params.toString();
  };

  useEffect(() => {
    const fetchActivos = async () => {
      setLoading(true);
      try {
        const urlParams = buildUrlParams();
        const response = await fetchWithAuth(`${API_BASE_URL}/api/activos?${urlParams}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        const result = await response.json();
        console.log('Activos API response:', result); // Debug log

        if (result.success && result.data && Array.isArray(result.data.data)) {
          // Normalize idActivo to id
          const normalizedActivos = result.data.data.map((activo) => ({
            ...activo,
            id: activo.idActivo,
          }));
          setActivos(normalizedActivos);
          setPagination(result.data.pagination || {
            current_page: 1,
            last_page: 1,
            per_page: perPage,
            total: normalizedActivos.length,
            from: 1,
            to: normalizedActivos.length,
            has_more_pages: false,
          });
        } else {
          console.error('Error fetching activos:', result.message || 'Invalid data format');
          setActivos([]);
          setPagination({
            current_page: 1,
            last_page: 1,
            per_page: perPage,
            total: 0,
            from: 0,
            to: 0,
            has_more_pages: false,
          });
          toast.error('Error al cargar activos: ' + (result.message || 'Formato de datos inválido'));
        }
      } catch (error) {
        console.error('Error fetching activos:', error.message);
        setActivos([]);
        setPagination({
          current_page: 1,
          last_page: 1,
          per_page: perPage,
          total: 0,
          from: 0,
          to: 0,
          has_more_pages: false,
        });
        toast.error('Error al cargar activos: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchActivos();
  }, [currentPage, perPage]);

  const handleSelectActivo = (activoId) => {
    const activoIdStr = String(activoId);
    setSelectedActivos((prev) => {
      const prevStr = prev.map((id) => String(id));
      const isSelected = prevStr.includes(activoIdStr);
      return isSelected ? [] : [activoId];
    });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSelectedActivos([]); // Limpiar selección al cambiar página
  };

  const handlePerPageChange = (newPerPage) => {
    setPerPage(newPerPage);
    setCurrentPage(1); // Volver a la primera página
    setSelectedActivos([]); // Limpiar selección
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
            <path
              stroke="default"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6h12m0 0l-4-4m4 4l-4 4m-18-2h12m0 0l-4-4m4 4l-4 4"
            />
          </svg>
          Gestión de Activos
        </h1>
        <div className="bg-white rounded-lg shadow">
          <ActivoTable
            activos={activos}
            loading={loading}
            selectedActivos={selectedActivos}
            handleSelectActivo={handleSelectActivo}
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
                  toast.success('Activo actualizado exitosamente');
                  // Recargar activos para reflejar los cambios
                  const urlParams = buildUrlParams();
                  const response = await fetchWithAuth(`${API_BASE_URL}/api/activos?${urlParams}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                  });
                  const result = await response.json();
                  if (result.success && result.data && Array.isArray(result.data.data)) {
                    const normalizedActivos = result.data.data.map((activo) => ({
                      ...activo,
                      id: activo.idActivo,
                    }));
                    setActivos(normalizedActivos);
                    setPagination(result.data.pagination || {
                      current_page: 1,
                      last_page: 1,
                      per_page: perPage,
                      total: normalizedActivos.length,
                      from: 1,
                      to: normalizedActivos.length,
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
                toast.error('Error al actualizar activo');
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