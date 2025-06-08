import React, { useState } from 'react';
import { fetchWithAuth } from '../../../../js/authToken';
import API_BASE_URL from '../../../../js/urlHelper';
import { Server, MapPin, Tag } from 'lucide-react';
import { toast } from 'react-toastify';

const ActivoRegister = () => {
  const [formData, setFormData] = useState({
    codigo_inventario: '',
    ubicacion: '',
    tipo: '',
    marca_modelo: '',
    estado: 1,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

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
      const response = await fetchWithAuth(`${API_BASE_URL}/api/activos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (result.success) {
        toast.success('Activo registrado exitosamente');
        setFormData({
          codigo_inventario: '',
          ubicacion: '',
          tipo: '',
          marca_modelo: '',
          estado: 1,
        });
      } else {
        setErrors(result.errors || { general: result.message });
        toast.error(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Error:', error.message);
      toast.error('Error al registrar activo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Server className="w-8 h-8" />
          Registro de Activos
        </h1>
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-800 border-b-2 border-blue-200 pb-2">
                DETALLES DEL ACTIVO
              </h3>
              <div className="relative">
                <Tag className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="codigo_inventario"
                  value={formData.codigo_inventario}
                  onChange={handleInputChange}
                  placeholder="Código de Inventario"
                  className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.codigo_inventario ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.codigo_inventario && <p className="text-red-500 text-sm mt-1">{errors.codigo_inventario}</p>}
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="ubicacion"
                  value={formData.ubicacion}
                  onChange={handleInputChange}
                  placeholder="Ubicación"
                  className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.ubicacion ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.ubicacion && <p className="text-red-500 text-sm mt-1">{errors.ubicacion}</p>}
              </div>
              <div className="relative">
                <Server className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleInputChange}
                  placeholder="Tipo"
                  className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.tipo ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.tipo && <p className="text-red-500 text-sm mt-1">{errors.tipo}</p>}
              </div>
            </div>
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-800 border-b-2 border-blue-200 pb-2">
                INFORMACIÓN ADICIONAL
              </h3>
              <div className="relative">
                <input
                  type="text"
                  name="marca_modelo"
                  value={formData.marca_modelo}
                  onChange={handleInputChange}
                  placeholder="Marca/Modelo"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.marca_modelo ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.marca_modelo && <p className="text-red-500 text-sm mt-1">{errors.marca_modelo}</p>}
              </div>
              <div className="relative">
                <select
                  name="estado"
                  value={formData.estado}
                  onChange={handleInputChange}
                  className="w-full pl-4 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white"
                >
                  <option value={1}>ACTIVO</option>
                  <option value={0}>INACTIVO</option>
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
              onClick={() => setFormData({ codigo_inventario: '', ubicacion: '', tipo: '', marca_modelo: '', estado: 1 })}
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

export default ActivoRegister;