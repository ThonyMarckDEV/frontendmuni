import React from 'react';
import { X, Server, MapPin, Tag } from 'lucide-react';

const EditActivoModal = ({
  formData,
  setFormData,
  errors,
  setErrors,
  loading,
  handleEditSubmit,
  setEditModalOpen,
}) => {
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Server className="w-7 h-7" />
            EDITAR ACTIVO
          </h2>
          <button onClick={() => setEditModalOpen(false)} className="text-white">
            <X className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleEditSubmit} className="p-8">
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
                  PROCESANDO...
                </div>
              ) : (
                'ACTUALIZAR'
              )}
            </button>
            <button
              type="button"
              onClick={() => setEditModalOpen(false)}
              className="bg-gray-300 text-gray-800 font-bold py-4 px-12 rounded-lg shadow-lg hover:bg-gray-400"
            >
              CANCELAR
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditActivoModal;