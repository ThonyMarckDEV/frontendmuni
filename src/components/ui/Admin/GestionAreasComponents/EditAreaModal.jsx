import React from 'react';
import { Edit, X } from 'lucide-react';

const EditAreaModal = ({
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
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h-4m-6 0H5a2 2 0 001 1.732V23m12-1.268A2 2 0 0019 23v-2"
              />
            </svg>
            EDITAR ÁREA
          </h2>
          <button onClick={() => setEditModalOpen(false)} className="text-white">
            <X className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleEditSubmit} className="p-8">
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 border-b-2 border-blue-200 pb-2">
              DATOS DEL ÁREA
            </h3>
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
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAreaModal;
