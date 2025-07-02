import React, { useState, useEffect } from 'react';
import { User, Lock, Mail, Phone, CreditCard, Building, Users } from 'lucide-react';
import { fetchWithAuth } from '../../../../js/authToken';
import API_BASE_URL from '../../../../js/urlHelper';
import { toast } from 'react-toastify';

const RegistroUsuarios = ({ userId = null, onSuccess = () => {} }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    dni: '',
    telefono: '',
    password: '',
    idRol: '',
    estado: 0,
    especializacion: '',
    idArea: '',
  });

  const [roles, setRoles] = useState([]);
  const [areas, setAreas] = useState([]);
  const [isUsuario, setIsUsuario] = useState(false); // ID 2
  const [isTecnico, setIsTecnico] = useState(false); // ID 3
  const [loading, setLoading] = useState(false);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [loadingAreas, setLoadingAreas] = useState(true);
  const [errors, setErrors] = useState({});
  const [isUpdating, setIsUpdating] = useState(!!userId);

  useEffect(() => {
    const fetchRoles = async () => {
      setLoadingRoles(true);
      try {
        const response = await fetchWithAuth(`${API_BASE_URL}/api/roles`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        const result = await response.json();
        if (result.success) {
          setRoles(result.data);
        } else {
          console.error('Error fetching roles:', result.message);
          toast.error('Error fetching roles:', result.message);
        }
      } catch (error) {
        console.error('Error fetching roles:', error);
        toast.error('Error fetching roles:', error);
      } finally {
        setLoadingRoles(false);
      }
    };

    const fetchAreas = async () => {
      setLoadingAreas(true);
      try {
        const response = await fetchWithAuth(`${API_BASE_URL}/api/areaslistar`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        const result = await response.json();
        if (result.success) {
          setAreas(result.data);
        } else {
          console.error('Error fetching areas:', result.message);
          toast.error('Error fetching areas:', result.message);
        }
      } catch (error) {
        console.error('Error fetching areas:', error);
        toast.error('Error fetching areas:', error);
      } finally {
        setLoadingAreas(false);
      }
    };

    fetchRoles();
    fetchAreas();

    if (userId) {
      const fetchUser = async () => {
        try {
          const response = await fetchWithAuth(`${API_BASE_URL}/api/users/${userId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          });
          const result = await response.json();
          if (result.success) {
            const user = result.data;
            setFormData({
              nombre: user.datos?.nombre || '',
              apellido: user.datos?.apellido || '',
              email: user.datos?.email || '',
              dni: user.datos?.dni || '',
              telefono: user.datos?.telefono || '',
              password: '',
              idRol: user.idRol || '',
              estado: user.estado || 0,
              especializacion: user.datos?.especializacion || '',
              idArea: user.datos?.idArea || '',
            });
            setIsUsuario(user.idRol === 2);
            setIsTecnico(user.idRol === 3);
          } else {
            console.error('Error fetching user:', result.message);
            toast.error('Error fetching user:', result.message);
          }
        } catch (error) {
          console.error('Error fetching user:', error);
          toast.error('Error fetching user:', error);
        }
      };
      fetchUser();
    }
  }, [userId]);

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
      idArea: selectedRoleId === 2 ? prev.idArea : '', // Reset idArea if not Usuario
    }));
    setIsUsuario(selectedRoleId === 2);
    setIsTecnico(selectedRoleId === 3);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!(formData.nombre || '').trim()) newErrors.nombre = 'El nombre es requerido';
    if (!(formData.apellido || '').trim()) newErrors.apellido = 'El campo apellido es obligatorio';
    if (!(formData.email || '').trim()) newErrors.email = 'El email debe completarse';
    if (!formData.idRol) newErrors.idRol = 'Debe especificar un rol';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'El formato del correo electrónico no es correcto';
    }

    if (!isUpdating && !formData.password) newErrors.password = 'La contraseña es requerida';
    if (isTecnico && !(formData.especializacion || '').trim()) {
      newErrors.especializacion = 'La especialización es requerida para técnicos';
    }
    if (isUsuario && !formData.idArea) {
      newErrors.idArea = 'El área es requerida para usuarios';
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
      const url = isUpdating
        ? `${API_BASE_URL}/api/users/${userId}`
        : `${API_BASE_URL}/api/users`;
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
        toast.success(isUpdating ? 'Usuario actualizado exitosamente' : 'Usuario registrado exitosamente');
        onSuccess();

        if (!isUpdating) {
          setFormData({
            nombre: '',
            apellido: '',
            email: '',
            dni: '',
            telefono: '',
            password: '',
            idRol: '',
            estado: 0,
            especializacion: '',
            idArea: '',
          });
          setIsUsuario(false);
          setIsTecnico(false);
        }
      } else {
        setErrors(result.errors || { general: result.message });
        toast.error(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Error:', error.message);
      toast.error(isUpdating ? 'Error al actualizar usuario' : 'Error al registrar usuario');
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
              <Users className="w-7 h-7" />
              {isUpdating ? 'Editar Usuario' : 'Registrar Usuario'} - Municipalidad
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Columna Izquierda - Datos Personales */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 border-b-2 border-blue-200 pb-2">
                  Datos Personales
                </h2>

                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    placeholder="Nombre"
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
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                  {errors.telefono && <p className="text-red-500 text-sm mt-1">{errors.telefono}</p>}
                </div>
              </div>

              {/* Columna Derecha - Datos de Usuario */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 border-b-2 border-blue-200 pb-2">
                  Datos de Usuario
                </h2>

                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder={isUpdating ? 'Nueva Contraseña (opcional)' : 'Contraseña'}
                    className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
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
                    className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white ${
                      errors.idRol ? 'border-red-500' : 'border-gray-300'
                    } ${loadingRoles ? 'cursor-not-allowed opacity-50' : ''}`}
                  >
                    {loadingRoles ? (
                      <option value="" disabled>
                        CARGANDO...
                      </option>
                    ) : (
                      <>
                        <option value="">SELECCIONE ROL</option>
                        {roles.map((rol) => (
                          <option key={rol.id} value={rol.id}>
                            {rol.nombre.toUpperCase()}
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

                {(isUsuario || isTecnico) && (
                  <div className="space-y-4 bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-800">INFORMACIÓN TÉCNICA</h3>

                    {isTecnico && (
                      <div>
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
                        {errors.especializacion && (
                          <p className="text-red-500 text-sm mt-1">{errors.especializacion}</p>
                        )}
                      </div>
                    )}

                    {isUsuario && (
                      <div className="relative">
                        <Building className="absolute left-3 top-3 w-5 h-5 text-gray-400 z-10" />
                        <select
                          name="idArea"
                          value={formData.idArea}
                          onChange={handleInputChange}
                          disabled={loadingAreas}
                          className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white ${
                            errors.idArea ? 'border-red-500' : 'border-gray-300'
                          } ${loadingAreas ? 'cursor-not-allowed opacity-50' : ''}`}
                        >
                          {loadingAreas ? (
                            <option value="" disabled>
                              CARGANDO ÁREAS...
                            </option>
                          ) : areas.length === 0 ? (
                            <option value="" disabled>
                              NO HAY ÁREAS DISPONIBLES
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
                    )}
                  </div>
                )}
              </div>
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
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegistroUsuarios;
