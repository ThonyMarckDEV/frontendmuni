import React, { useState, useEffect } from 'react';
import { fetchWithAuth } from '../../../../js/authToken';
import API_BASE_URL from '../../../../js/urlHelper';
import { Building, Package, Lock } from 'lucide-react';

const RegistroActivosAreas = () => {
  const [formData, setFormData] = useState({
    idArea: '',
    idActivo: '',
  });
  const [areas, setAreas] = useState([]);
  const [activos, setActivos] = useState([]);
  const [loadingAreas, setLoadingAreas] = useState(true);
  const [loadingActivos, setLoadingActivos] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 3000);
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
        console.error('Error fetching areas:', error);
        setAreas([]);
        showNotification('Error al cargar áreas', 'error');
      } finally {
        setLoadingAreas(false);
      }
    };

    const fetchActivos = async () => {
      setLoadingActivos(true);
      try {
        const response = await fetchWithAuth(`${API_BASE_URL}/api/getactivos`, {
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
        console.error('Error fetching activos:', error);
        setActivos([]);
        showNotification('Error al cargar activos', 'error');
      } finally {
        setLoadingActivos(false);
      }
    };

    fetchAreas();
    fetchActivos();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validateForm = () => {
      const newErrors = {};
      if (!formData.idArea) newErrors.idArea = 'Debe seleccionar un área';
      if (!formData.idActivo) newErrors.idActivo = 'Debe seleccionar un activo';
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };
    if (!validateForm()) return;
    setLoading(true);
    try {
      const payload = Object.fromEntries(
        Object.entries(formData).filter(([_, value]) => value !== '' && value !== null)
      );
      const response = await fetchWithAuth(`${API_BASE_URL}/api/activos-areas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (result.success) {
        showNotification('Asignación registrada exitosamente');
        setFormData({
          idArea: '',
          idActivo: '',
        });
        // Refresh activos to update isAssigned
        const activosResponse = await fetchWithAuth(`${API_BASE_URL}/api/getactivos`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        const activosResult = await activosResponse.json();
        if (activosResult.success && Array.isArray(activosResult.data)) {
          setActivos(activosResult.data);
        }
      } else {
        setErrors(result.errors || { general: result.message });
        showNotification(`Error: ${result.message}`, 'error');
      }
    } catch (error) {
      console.error('Error:', error.message);
      showNotification('Error al registrar asignación', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Building className="w-8 h-8" />
          Registro de Asignación de Activos a Áreas
        </h1>
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-800 border-b-2 border-blue-200 pb-2">
                DETALLES DE LA ASIGNACIÓN
              </h3>
              <div className="relative">
                <Building className="absolute left-3 top-3 w-5 h-5 text-gray-400 z-10" />
                <select
                  name="idArea"
                  value={formData.idArea}
                  onChange={handleInputChange}
                  disabled={loadingAreas}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white ${
                    errors.idArea ? 'border-red-500' : 'border-gray-300'
                  } ${loadingAreas ? 'cursor-not-allowed opacity-50' : ''}`}
                >
                  {loadingAreas ? (
                    <option value="" disabled>
                      CARGANDO ÁREAS...
                    </option>
                  ) : areas.length === 0 ? (
                    <option value="" disabled>
                      NO HAY ÁREAS DISPONIBLES
                    </option>
                  ) : (
                    <>
                      <option value="">SELECCIONE ÁREA</option>
                      {areas.map((area) => (
                        <option key={area.idArea} value={area.idArea}>
                          {area.nombre.toUpperCase()}
                        </option>
                      ))}
                    </>
                  )}
                </select>
                <div className="absolute right-3 top-3 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                {errors.idArea && <p className="text-red-500 text-sm mt-1">{errors.idArea}</p>}
              </div>
            </div>
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-800 border-b-2 border-blue-200 pb-2">
                SELECCIÓN DE ACTIVO
              </h3>
              <div className="relative">
                <Package className="absolute left-3 top-3 w-5 h-5 text-gray-400 z-10" />
                <select
                  name="idActivo"
                  value={formData.idActivo}
                  onChange={handleInputChange}
                  disabled={loadingActivos}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white ${
                    errors.idActivo ? 'border-red-500' : 'border-gray-300'
                  } ${loadingActivos ? 'cursor-not-allowed opacity-50' : ''}`}
                >
                  {loadingActivos ? (
                    <option value="" disabled>
                      CARGANDO ACTIVOS...
                    </option>
                  ) : activos.length === 0 ? (
                    <option value="" disabled>
                      NO HAY ACTIVOS DISPONIBLES
                    </option>
                  ) : (
                    <>
                      <option value="">SELECCIONE ACTIVO</option>
                      {activos.map((activo) => (
                        <option
                          key={activo.idActivo}
                          value={activo.idActivo}
                          disabled={activo.isAssigned}
                          className={activo.isAssigned ? 'text-gray-500 bg-gray-100' : ''}
                        >
                          {activo.isAssigned ? (
                            <span>
                              <Lock className="inline w-4 h-4 mr-1" />
                              COD: {activo.codigo_inventario} - MARCA: {activo.marca_modelo} - TIPO: {activo.tipo} - Asignado a Area de: {activo.assigned_area?.nombre.toUpperCase()}
                            </span>
                          ) : (
                            `COD: ${activo.codigo_inventario} - MARCA: ${activo.marca_modelo} - TIPO: ${activo.tipo}`
                          )}
                        </option>
                      ))}
                    </>
                  )}
                </select>
                <div className="absolute right-3 top-3 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                {errors.idActivo && <p className="text-red-500 text-sm mt-1">{errors.idActivo}</p>}
              </div>
            </div>
          </div>
          <div className="mt-8 flex justify-center gap-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 px-12 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  REGISTRANDO...
                </div>
              ) : (
                'REGISTRAR'
              )}
            </button>
            <button
              type="button"
              onClick={() => setFormData({ idArea: '', idActivo: '' })}
              className="bg-gray-300 text-gray-800 font-bold py-4 px-4 rounded-lg shadow-lg hover:bg-gray-400"
            >
              LIMPIAR
            </button>
          </div>
          {notification.show && (
            <div
              className={`fixed top-4 right-4 ${
                notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'
              } text-white px-4 py-2 rounded-lg shadow-lg z-50`}
            >
              {notification.message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default RegistroActivosAreas;
