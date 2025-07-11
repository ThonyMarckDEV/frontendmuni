import React, { useState } from 'react';
import { Building, X } from 'lucide-react';

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
  activoAreaId,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setIsSubmitting(true);
    await handleEditSubmit(e, activoAreaId);
    setIsSubmitting(false);
  };

  const currentActivo = activos.find((a) => a.idActivo === parseInt(formData.idActivo));

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
        <form onSubmit={handleSubmit} className="p-8">
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 border-b-2 border-blue-200 pb-2">
              DETALLES DE LA ASIGNACIÓN
            </h3>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Activo</label>
              <div className="relative">
                <svg
                  className="absolute left-3 top-3 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                <select
                  name="idActivo"
                  value={formData.idActivo}
                  disabled={true}
                  className="w-full pl-10 pr-4 py-3 border rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                >
                  {loadingActivos ? (
                    <option value="" disabled>
                      CARGANDO ACTIVOS...
                    </option>
                  ) : currentActivo ? (
                    <option value={currentActivo.idActivo}>
                      COD: {currentActivo.codigo_inventario} - MARCA: {currentActivo.marca_modelo} - TIPO: {currentActivo.tipo}
                    </option>
                  ) : (
                    <option value="" disabled>
                      ACTIVO NO ENCONTRADO
                    </option>
                  )}
                </select>
              </div>
              {errors.idActivo && <p className="text-red-500 text-sm mt-1">{errors.idActivo}</p>}
            </div>
            <div className="relative">
              <Building className="absolute left-3 top-3 w-5 h-5 text-gray-400 z-10" />
              <select
                name="idArea"
                value={formData.idArea}
                onChange={handleInputChange}
                disabled={loadingAreas || isSubmitting}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white ${
                  errors.idArea ? 'border-red-500' : 'border-gray-300'
                } ${loadingAreas || isSubmitting ? 'cursor-not-allowed opacity-50' : ''}`}
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
            {errors.general && (
              <div className="mt-4 text-red-500 text-center">{errors.general}</div>
            )}
            <div className="mt-8 flex justify-center gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-4 px-12 rounded-lg shadow-lg transform transition-all duration-200 ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:from-blue-700 hover:to-blue-800 hover:scale-105'
                }`}
              >
                {isSubmitting && (
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                )}
                {isSubmitting ? 'Actualizando...' : 'ACTUALIZAR'}
              </button>
              <button
                type="button"
                onClick={() => setEditModalOpen(false)}
                disabled={isSubmitting}
                className={`bg-gray-300 text-gray-800 font-bold py-4 px-12 rounded-lg shadow-lg hover:bg-gray-400 ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
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
