import React, { useState, useEffect } from 'react';
import { fetchWithAuth } from '../../../js/authToken';
import API_BASE_URL from '../../../js/urlHelper';
import { AlertTriangle, Calendar } from 'lucide-react';

const IncidenteRegister = () => {
  const [formData, setFormData] = useState({
    activo_id: '',
    descripcion: '',
    fecha_reporte: new Date().toISOString().split('T')[0], // Current date as default
    estado: 'Pendiente',
  });
  const [activos, setActivos] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingActivos, setLoadingActivos] = useState(false);

  useEffect(() => {
    const fetchActivos = async () => {
      setLoadingActivos(true);
      try {
        const response = await fetchWithAuth(`${API_BASE_URL}/api/incidentes/activos`, {
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
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };
    if (!validateForm()) return;
    setLoading(true);
    try {
      const payload = Object.fromEntries(
        Object.entries(formData).filter(([_, value]) => value !== '' && value !== null)
      );
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
          descripcion: '',
          fecha_reporte: new Date().toISOString().split('T')[0],
          estado: 'Pendiente',
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
                <select
                  name="activo_id"
                  value={formData.activo_id}
                  onChange={handleInputChange}
                  disabled={loadingActivos}
                  className={`w-full pl-4 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white ${
                    errors.activo_id ? 'border-red-500' : 'border-gray-300'
                  } ${loadingActivos ? 'cursor-not-allowed opacity-50' : ''}`}
                >
                  {loadingActivos ? (
                    <option value="" disabled>
                      CARGANDO ACTIVOS...
                    </option>
                  ) : (
                    <>
                      <option value="">SELECCIONE ACTIVO</option>
                      {activos.map((activo) => (
                        <option key={activo.id} value={activo.id}>
                          {activo.codigo_inventario}
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
              <div className="relative">
                <select
                  name="estado"
                  value={formData.estado}
                  onChange={handleInputChange}
                  className="w-full pl-4 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white"
                >
                  <option value="Pendiente">PENDIENTE</option>
                  <option value="En Proceso">EN PROCESO</option>
                  <option value="Resuelto">RESUELTO</option>
                </select>
                <div className="absolute right-3 top-3 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          {errors.general && (
            <div className="mt-4 text-red-500 text-center">{errors.general}</div>
          )}
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
              onClick={() =>
                setFormData({
                  activo_id: '',
                  descripcion: '',
                  fecha_reporte: new Date().toISOString().split('T')[0],
                  estado: 'Pendiente',
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