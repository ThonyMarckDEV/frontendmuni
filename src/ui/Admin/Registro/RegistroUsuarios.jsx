import React, { useState, useEffect } from 'react';
import { User, Lock, Mail, Phone, MapPin, CreditCard, Building, Users } from 'lucide-react';

const RegistroUsuarios = () => {
  const [formData, setFormData] = useState({
    // Datos personales
    nombre: '',
    apellido: '',
    email: '',
    direccion: '',
    dni: '',
    ruc: '',
    telefono: '',
    // Datos de usuario
    username: '',
    password: '',
    idRol: '',
    estado: 1,
    // Campos técnicos adicionales
    telefonoTecnico: '',
    especializacion: '',
    area: ''
  });

  const [roles, setRoles] = useState([
    { id: 1, nombre: 'Administrador' },
    { id: 2, nombre: 'Técnico' },
    { id: 3, nombre: 'Usuario' },
    { id: 4, nombre: 'Supervisor' }
  ]);

  const [esTecnico, setEsTecnico] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleRoleChange = (e) => {
    const selectedRoleId = parseInt(e.target.value);
    setFormData(prev => ({
      ...prev,
      idRol: selectedRoleId
    }));
    
    // Verificar si es técnico (asumiendo que rol 2 es técnico)
    setEsTecnico(selectedRoleId === 2);
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validaciones básicas
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
    if (!formData.apellido.trim()) newErrors.apellido = 'El apellido es requerido';
    if (!formData.email.trim()) newErrors.email = 'El email es requerido';
    if (!formData.username.trim()) newErrors.username = 'El nombre de usuario es requerido';
    if (!formData.password.trim()) newErrors.password = 'La contraseña es requerida';
    if (!formData.idRol) newErrors.idRol = 'Debe seleccionar un rol';
    
    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'El formato del email no es válido';
    }
    
    // Validaciones para técnico
    if (esTecnico) {
      if (!formData.telefonoTecnico.trim()) newErrors.telefonoTecnico = 'El teléfono es requerido para técnicos';
      if (!formData.especializacion.trim()) newErrors.especializacion = 'La especialización es requerida';
      if (!formData.area.trim()) newErrors.area = 'El área es requerida';
    }
    
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
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Aquí iría la llamada real a tu API Laravel
      // const response = await fetch('/api/users', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Accept': 'application/json',
      //   },
      //   body: JSON.stringify(formData)
      // });
      
      alert('Usuario registrado exitosamente');
      
      // Limpiar formulario
      setFormData({
        nombre: '',
        apellido: '',
        email: '',
        direccion: '',
        dni: '',
        ruc: '',
        telefono: '',
        username: '',
        password: '',
        idRol: '',
        estado: 1,
        telefonoTecnico: '',
        especializacion: '',
        area: ''
      });
      setEsTecnico(false);
      
    } catch (error) {
      console.error('Error:', error);
      alert('Error al registrar usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
            <h1 className="text-2xl font-bold text-white text-center flex items-center justify-center gap-2">
              <Users className="w-7 h-7" />
              Registrar y/o Editar Usuario - Municipalidad
            </h1>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Columna Izquierda - Datos Personales */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 border-b-2 border-blue-200 pb-2">
                  Datos Personales
                </h2>
                
                {/* Nombre y Apellido */}
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    placeholder="Nombre y Apellidos"
                    className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
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
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.apellido ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.apellido && <p className="text-red-500 text-sm mt-1">{errors.apellido}</p>}
                </div>

                {/* Email */}
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Correo Institucional"
                    className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                {/* Dirección */}
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleInputChange}
                    placeholder="Dirección"
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* DNI y RUC */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="dni"
                      value={formData.dni}
                      onChange={handleInputChange}
                      placeholder="DNI"
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      name="ruc"
                      value={formData.ruc}
                      onChange={handleInputChange}
                      placeholder="RUC"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Teléfono */}
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    placeholder="Teléfono"
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Columna Derecha - Datos de Usuario */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 border-b-2 border-blue-200 pb-2">
                  Datos de Usuario
                </h2>

                {/* Username */}
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Nombre de Usuario"
                    className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.username ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
                </div>

                {/* Contraseña */}
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Contraseña"
                    className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                </div>

                {/* Seleccionar Rol */}
                <div className="relative">
                  <Building className="absolute left-3 top-3 w-5 h-5 text-gray-400 z-10" />
                  <select
                    name="idRol"
                    value={formData.idRol}
                    onChange={handleRoleChange}
                    className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white ${
                      errors.idRol ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Seleccione Rol</option>
                    {roles.map(rol => (
                      <option key={rol.id} value={rol.id}>{rol.nombre}</option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  {errors.idRol && <p className="text-red-500 text-sm mt-1">{errors.idRol}</p>}
                </div>

                {/* Campos específicos para Técnico */}
                {esTecnico && (
                  <div className="space-y-4 bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-800">Información Técnica</h3>
                    
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        name="telefonoTecnico"
                        value={formData.telefonoTecnico}
                        onChange={handleInputChange}
                        placeholder="Teléfono"
                        className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                          errors.telefonoTecnico ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.telefonoTecnico && <p className="text-red-500 text-sm mt-1">{errors.telefonoTecnico}</p>}
                    </div>

                    <input
                      type="text"
                      name="especializacion"
                      value={formData.especializacion}
                      onChange={handleInputChange}
                      placeholder="Especialización"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        errors.especializacion ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.especializacion && <p className="text-red-500 text-sm mt-1">{errors.especializacion}</p>}

                    <input
                      type="text"
                      name="area"
                      value={formData.area}
                      onChange={handleInputChange}
                      placeholder="Área"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        errors.area ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.area && <p className="text-red-500 text-sm mt-1">{errors.area}</p>}
                  </div>
                )}
              </div>
            </div>

            {/* Botón de Submit */}
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
                ) : (
                  'REGISTRAR / ACTUALIZAR'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistroUsuarios;