import React, { useState, useEffect } from 'react';
import { Building, Edit } from 'lucide-react';
import { fetchWithAuth } from '../../../../js/authToken';
import API_BASE_URL from '../../../../js/urlHelper';

const RegistroAreas = ({ areaId = null, onSuccess = () => {} }) => {
  const [formData, setFormData] = useState({
    nombre: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isUpdating, setIsUpdating] = useState(!!areaId);

  useEffect(() => {
    if (areaId) {
      const fetchArea = async () => {
        try {
          const response = await fetchWithAuth(`${API_BASE_URL}/api/areas/${areaId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          });
          const result = await response.json();
          if (result.success) {
            const area = result.data;
            setFormData({
              nombre: area.nombre || '',
            });
          } else {
            console.error('Error fetching area:', result.message);
          }
        } catch (error) {
          console.error('Error fetching area:', error);
        }
      };
      fetchArea();
    }
  }, [areaId]);

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

  const validateForm = () => {
    const newErrors = {};
    if (!(formData.nombre || '').trim()) newErrors.nombre = 'El nombre del área es requerido';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const url = isUpdating
        ? `${API_BASE_URL}/api/areas/${areaId}`
        : `${API_BASE_URL}/api/areas`;
      const method = isUpdating ? 'PUT' : 'POST';

      const payload = isUpdating
        ? Object.fromEntries(
            Object.entries(formData).filter(([_, value]) => value !== '' && value !== null)
          )
        : formData;

      const response = await fetchWithAuth(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        alert(isUpdating ? 'Área actualizada exitosamente' : 'Área registrada exitosamente');
        onSuccess();

        if (!isUpdating) {
          setFormData({ nombre: '' });
        }
      } else {
        setErrors(result.errors || { general: result.message });
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Error:', error.message);
      alert(isUpdating ? 'Error al actualizar área' : 'Error al registrar área');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
            <h1 className="text-2xl font-bold text-white text-center flex items-center justify-center gap-2">
              <Building className="w-7 h-7" />
              {isUpdating ? 'Editar Área' : 'Registrar Área'} - Municipalidad
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 border-b-2 border-blue-200 pb-2">
                Datos del Área
              </h2>

              <div className="relative">
                <Edit className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  placeholder="Nombre del Área"
                  className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.nombre ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.nombre && <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>}
              </div>

              {errors.general && (
                <div className="mt-4 text-red-500 text-center">{errors.general}</div>
              )}

              <div className="mt-8 flex justify-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 px-12 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      PROCESANDO...
                    </div>
                  ) : isUpdating ? (
                    'ACTUALIZAR'
                  ) : (
                    'REGISTRAR'
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegistroAreas;