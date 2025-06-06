import React from 'react';
import { Package, Building, X } from 'lucide-react';

const EditActivoAreaModal = ({
  formData,
  setFormData,
  errors,
  setErrors,
  areas,
  activos,
  loadingAreas,
  loadingActivos,
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
            EDITAR ASIGNACIÓN
          </h2>
          <button onClick={() => setEditModalOpen(false)} className="text-white">
            <X className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleEditSubmit} className="p-8">
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
              {errors.idActivo && <p className="text-red-500 text-sm mt-1">{errors.idActivo}</p>}
            </div>
            {errors.general && (
              <div className="mt-4 text-red-500 text-center">{errors.general}</div>
            )}
            <div className="mt-8 flex justify-center gap-4">
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 px-12 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105"
              >
                ACTUALIZAR
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

export default EditActivoAreaModal;
