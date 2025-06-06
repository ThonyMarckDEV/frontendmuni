import React from 'react';
import { User, Mail, CreditCard, Phone, Lock, Building, X } from 'lucide-react';

const EditUserModal = ({
  formData,
  setFormData,
  errors,
  setErrors,
  roles,
  areas,
  loading,
  loadingRoles,
  loadingAreas,
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

  const handleRoleChange = (e) => {
    const selectedRoleId = parseInt(e.target.value);
    setFormData((prev) => ({
      ...prev,
      idRol: selectedRoleId,
      idArea: selectedRoleId === 2 ? prev.idArea : '',
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            EDITAR USUARIO
          </h2>
          <button onClick={() => setEditModalOpen(false)} className="text-white">
            <X className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleEditSubmit} className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-800 border-b-2 border-blue-200 pb-2">
                DATOS PERSONALES
              </h3>
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  placeholder="Nombre"
                  className={`w-full pl-11 pr-4 py-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.nombre ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.nombre && <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>}
              </div>
              <div className="relative">
                <input
                  type="text"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleInputChange}
                  placeholder="Apellidos"
                  className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.apellido ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.apellido && <p className="text-red-500 text-sm mt-1">{errors.apellido}</p>}
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-2 w-5 h-6 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Correo Electrónico"
                  className={`w-full pl-11 pr-4 py-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
              <div className="relative">
                <CreditCard className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="dni"
                  value={formData.dni}
                  onChange={handleInputChange}
                  placeholder="DNI"
                  className="w-full pl-11 pr-4 py-3 border rounded-md border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                {errors.dni && <p className="text-red-500 text-sm mt-1">{errors.dni}</p>}
              </div>
              <div className="relative">
                <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  placeholder="Teléfono"
                  className="w-full pl-11 pr-4 py-3 border rounded-md border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                {errors.telefono && <p className="text-red-500 text-sm mt-1">{errors.telefono}</p>}
              </div>
            </div>
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-800 border-b-2 border-blue-200 pb-2">
                DATOS DE USUARIO
              </h3>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-3 h-5 text-gray-600" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Nueva Contraseña (opcional)"
                  className={`w-full pl-11 pr-4 py-3 border rounded-md rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>
              <div className="relative">
                <Building className="absolute left-3 top-3 w-5 h-5 text-gray-400 z-10" />
                <select
                  name="idRol"
                  value={formData.idRol}
                  onChange={handleRoleChange}
                  disabled={loadingRoles}
                  className={`w-full pl-11 pr-4 py-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all rounded-lg appearance-none bg-white ${
                    errors.idRol ? 'border-red-500' : 'border-gray-300'
                  } ${loadingRoles ? 'cursor-not-allowed opacity-50' : ''}`}
                >
                  {loadingRoles ? (
                    <option value="0" disabled>
                      CARGANDO...
                    </option>
                  ) : (
                    <>
                      <option value="0">SELECCIONE EL ROL</option>
                      {roles.map((role, index) => (
                        <option key={index} value={role.id}>
                          {role.nombre.toUpperCase()}
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
                {errors.idRol && <p className="text-red-500 text-sm mt-1">{errors.idRol}</p>}
              </div>
              <div className="relative">
                <select
                  name="estado"
                  value={formData.estado}
                  onChange={handleInputChange}
                  className="w-full pl-4 py-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all rounded-lg appearance-none bg-white"
                >
                  <option value={0}>ACTIVABLE</option>
                  <option value={1}>ACTIVADO</option>
                </select>
                <div className="absolute right-3 top-3 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {(formData.idRol === 2 || formData.idRol === 3) && (
                <div className="space-y-4 bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800">INFORMACIÓN TÉCNICA</h4>
                  {formData.idRol === 3 && (
                    <div>
                      <input
                        type="text"
                        name="especializacion"
                        value={formData.especializacion}
                        onChange={handleInputChange}
                        placeholder="Especialización"
                        className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all rounded-lg ${
                          errors.especializacion ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.especializacion && (
                        <p className="text-red-500 text-sm mt-1">{errors.especializacion}</p>
                      )}
                    </div>
                  )}
                  {formData.idRol === 2 && (
                    <div className="relative">
                      <Building className="absolute left-3 top-3 w-5 h-5 text-gray-400 z-10" />
                      <select
                        name="idArea"
                        value={formData.idArea}
                        onChange={handleInputChange}
                        disabled={loadingAreas}
                        className={`w-full pl-11 pr-4 py-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all rounded-lg appearance-none bg-white ${
                          errors.idArea ? 'border-red-500' : 'border-gray-300'
                        } ${loadingAreas ? 'cursor-not-allowed opacity-50' : ''}`}
                      >
                        {loadingAreas ? (
                          <option value="0" disabled>
                            CARGANDO ÁREAS...
                          </option>
                        ) : areas.length === 0 ? (
                          <option value="0" disabled>
                            NO HAY ÁREAS DISPONIBLES
                          </option>
                        ) : (
                          <>
                            <option value="0">SELECCIONE ÁREA</option>
                            {areas.map((area, index) => (
                              <option key={area.id || index} value={area.idArea}>
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
                  )}
                </div>
              )}
            </div>
          </div>
          {errors.error && (
            <div className="mt-4 text-red-500 text-center">{errors.error}</div>
          )}
          <div className="mt-8 flex justify-center gap-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:bg-blue-800 hover:to-blue-900 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400 disabled:cursor-not-allowed"
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
              className="bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded hover:bg-gray-400"
            >
              CANCELAR
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;
