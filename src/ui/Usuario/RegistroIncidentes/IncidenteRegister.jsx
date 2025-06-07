import React, { useState, useEffect } from 'react';
import { fetchWithAuth } from '../../../js/authToken';
import API_BASE_URL from '../../../js/urlHelper';
import { AlertTriangle, Calendar, Building, Lock } from 'lucide-react';

const IncidenteRegister = () => {
  const [formData, setFormData] = useState({
    activo_id: '',
    titulo: '',
    descripcion: '',
    fecha_reporte: new Date().toISOString().split('T')[0],
    prioridad: '0', // Default to Baja
  });
  const [activos, setActivos] = useState([]);
  const [userArea, setUserArea] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingActivos, setLoadingActivos] = useState(false);
  const [loadingUserArea, setLoadingUserArea] = useState(false);

  useEffect(() => {
    const fetchUserArea = async () => {
      setLoadingUserArea(true);
      try {
        const response = await fetchWithAuth(`${API_BASE_URL}/api/userArea`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        const result = await response.json();
        if (result.success && result.data.datos && result.data.datos.area) {
          setUserArea(result.data.datos.area);
        } else {
          setErrors((prev) => ({ ...prev, general: 'No se pudo cargar el área del usuario' }));
        }
      } catch (error) {
        console.error('Error fetching user area:', error);
        setErrors((prev) => ({ ...prev, general: 'Error al cargar el área del usuario' }));
      } finally {
        setLoadingUserArea(false);
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
          setErrors((prev) => ({ ...prev, general: result.message }));
        }
      } catch (error) {
        console.error('Error fetching activos:', error);
        setErrors((prev) => ({ ...prev, general: 'Error al cargar los activos' }));
      } finally {
        setLoadingActivos(false);
      }
    };

    fetchUserArea();
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
        titulo: formData.titulo || null,
        descripcion: formData.descripcion,
        fecha_reporte: formData.fecha_reporte,
        prioridad: parseInt(formData.prioridad),
      };
      const response = await fetchWithAuth(`${API_BASE_URL}/api/incidentes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (result.success) {
        alert('Incidente registrado exitosamente');
        setFormData({
          activo_id: '',
          titulo: '',
          descripcion: '',
          fecha_reporte: new Date().toISOString().split('T')[0],
          prioridad: '0',
        });
      } else {
        setErrors(result.errors || { general: result.message });
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Error:', error.message);
      alert('Error al registrar incidente');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <AlertTriangle className="w-8 h-8" />
          Registro de Incidentes
        </h1>
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-800 border-b-2 border-blue-200 pb-2">
                DETALLES DEL INCIDENTE
              </h3>
              <div className="relative">
                <Building className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <Lock className="absolute left-10 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={loadingUserArea ? 'Cargando...' : userArea ? userArea.nombre.toUpperCase() : 'Sin área asignada'}
                  disabled
                  className="w-full pl-16 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                />
                {errors.general && userArea === null && (
                  <p className="text-red-500 text-sm mt-1">{errors.general}</p>
                )}
              </div>
              <div className="relative">
                <select
                  name="activo_id"
                  value={formData.activo_id}
                  onChange={handleInputChange}
                  disabled={loadingActivos || activos.length === 0 || loadingUserArea || !userArea}
                  className={`w-full pl-4 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white ${
                    errors.activo_id ? 'border-red-500' : 'border-gray-300'
                  } ${loadingActivos || activos.length === 0 || loadingUserArea || !userArea ? 'cursor-not-allowed opacity-50' : ''}`}
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
                        <option key={activo.idActivo} value={activo.idActivo}>
                           COD: {activo.codigo_inventario} - MARCA: {activo.marca_modelo} -  TIPO: {activo.tipo} 
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
                {errors.activo_id && <p className="text-red-500 text-sm mt-1">{errors.activo_id}</p>}
              </div>
              <div className="relative">
                <input
                  type="text"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleInputChange}
                  placeholder="Título del Incidente (Opcional)"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.titulo ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.titulo && <p className="text-red-500 text-sm mt-1">{errors.titulo}</p>}
              </div>
              <div className="relative">
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  placeholder="Descripción del Incidente"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.descripcion ? 'border-red-500' : 'border-gray-300'
                  }`}
                  rows="4"
                />
                {errors.descripcion && <p className="text-red-500 text-sm mt-1">{errors.descripcion}</p>}
              </div>
              <div className="relative">
                <select
                  name="prioridad"
                  value={formData.prioridad}
                  onChange={handleInputChange}
                  className={`w-full pl-4 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white ${
                    errors.prioridad ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="0">Baja</option>
                  <option value="1">Media</option>
                  <option value="2">Alta</option>
                </select>
                <div className="absolute right-3 top-3 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                {errors.prioridad && <p className="text-red-500 text-sm mt-1">{errors.prioridad}</p>}
              </div>
            </div>
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-800 border-b-2 border-blue-200 pb-2">
                INFORMACIÓN ADICIONAL
              </h3>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  name="fecha_reporte"
                  value={formData.fecha_reporte}
                  onChange={handleInputChange}
                  className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.fecha_reporte ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.fecha_reporte && <p className="text-red-500 text-sm mt-1">{errors.fecha_reporte}</p>}
              </div>
            </div>
          </div>
          {errors.general && !userArea && (
            <div className="mt-4 text-red-500 text-center">{errors.general}</div>
          )}
          <div className="mt-8 flex justify-center gap-4">
            <button
              type="submit"
              disabled={loading || activos.length === 0 || loadingUserArea || !userArea}
              className={`bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 px-12 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105 ${
                loading || activos.length === 0 || loadingUserArea || !userArea ? 'opacity-50 cursor-not-allowed' : ''
              }`}
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
              onClick={() =>
                setFormData({
                  activo_id: '',
                  titulo: '',
                  descripcion: '',
                  fecha_reporte: new Date().toISOString().split('T')[0],
                  prioridad: '0',
                })
              }
              className="bg-gray-300 text-gray-800 font-bold py-4 px-12 rounded-lg shadow-lg hover:bg-gray-400"
            >
              LIMPIAR
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IncidenteRegister;
