import React, { useState, useEffect } from 'react';
import { User, Lock, Mail, Phone, CreditCard, Building, Users, Search, Edit, Eye, X } from 'lucide-react';
import { fetchWithAuth } from '../../../js/authToken';
import API_BASE_URL from '../../../js/urlHelper';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
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
    area: '',
  });
  const [errors, setErrors] = useState({});

  // Fetch roles and users on mount
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
        }
      } catch (error) {
        console.error('Error fetching roles:', error);
      } finally {
        setLoadingRoles(false);
      }
    };

    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await fetchWithAuth(`${API_BASE_URL}/api/users`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        const result = await response.json();
        if (result.success) {
          setUsers(result.data.data); // Assuming paginated response
        } else {
          console.error('Error fetching users:', result.message);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
    fetchUsers();
  }, []);

  // Handle checkbox selection
  const handleSelectUser = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  // Handle search and role filter
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.datos?.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.datos?.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.datos?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.datos?.dni?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole ? user.idRol === parseInt(selectedRole) : true;
    return matchesSearch && matchesRole;
  });

  // Open edit modal
  const openEditModal = (user) => {
    setCurrentUser(user);
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
      area: user.datos?.area || '',
    });
    setEditModalOpen(true);
  };

  // Open details modal
  const openDetailsModal = (user) => {
    setCurrentUser(user);
    setDetailsModalOpen(true);
  };

  // Handle input change in edit modal
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

  // Handle role change in edit modal
  const handleRoleChange = (e) => {
    const selectedRoleId = parseInt(e.target.value);
    setFormData((prev) => ({
      ...prev,
      idRol: selectedRoleId,
    }));
  };

  // Validate edit form
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

    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (formData.idRol === 3 && !(formData.especializacion || '').trim()) {
      newErrors.especializacion = 'La especialización es requerida para técnicos';
    }
    if (formData.idRol === 2 && !(formData.area || '').trim()) {
      newErrors.area = 'El área es requerida para usuarios';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission for edit
  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const payload = Object.fromEntries(
        Object.entries(formData).filter(([_, value]) => value !== '' && value !== null)
      );

      const response = await fetchWithAuth(`${API_BASE_URL}/api/users/${currentUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        alert('Usuario actualizado exitosamente');
        setUsers((prev) =>
          prev.map((user) =>
            user.id === currentUser.id
              ? { ...user, ...result.data, datos: { ...user.datos, ...result.data.datos } }
              : user
          )
        );
        setEditModalOpen(false);
        setSelectedUsers([]);
      } else {
        setErrors(result.errors || { general: result.message });
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Error:', error.message);
      alert('Error al actualizar usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Users className="w-8 h-8" /> Gestión de Usuarios
        </h1>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow p-4 mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, apellido, email o DNI"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Building className="absolute left-3 top-3 w-5 h-5 text-gray-400 z-10" />
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              disabled={loadingRoles}
              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white ${
                loadingRoles ? 'cursor-not-allowed opacity-50' : ''
              }`}
            >
              {loadingRoles ? (
                <option value="" disabled>
                  CARGANDO...
                </option>
              ) : (
                <>
                  <option value="">TODOS LOS ROLES</option>
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
          </div>
        </div>

        {/* User Table */}
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Seleccionar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Apellido
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  DNI
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                    Cargando usuarios...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                    No se encontraron usuarios
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => handleSelectUser(user.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.datos?.nombre || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.datos?.apellido || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.datos?.dni || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.datos?.email || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {roles.find((rol) => rol.id === user.idRol)?.nombre.toUpperCase() || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.estado ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {user.estado ? 'ACTIVO' : 'INACTIVO'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Action Bar */}
        {selectedUsers.length === 1 && (
          <div className="mt-4 bg-white rounded-lg shadow p-4 flex gap-4">
            <button
              onClick={() => openEditModal(users.find((user) => user.id === selectedUsers[0]))}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Edit className="w-5 h-5" /> EDITAR
            </button>
            <button
              onClick={() => openDetailsModal(users.find((user) => user.id === selectedUsers[0]))}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Eye className="w-5 h-5" /> VER DETALLES
            </button>
          </div>
        )}

        {/* Edit Modal */}
        {editModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Users className="w-7 h-7" /> EDITAR USUARIO
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
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-800 border-b-2 border-blue-200 pb-2">
                      DATOS DE USUARIO
                    </h3>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Nueva Contraseña (opcional)"
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
                              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                errors.especializacion ? 'border-red-500' : 'border-gray-300'
                              }`}
                            />
                            {errors.especializacion && (
                              <p className="text-red-500 text-sm mt-1">{errors.especializacion}</p>
                            )}
                          </div>
                        )}
                        {formData.idRol === 2 && (
                          <div>
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
                    )}
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
        )}

        {/* Details Modal */}
        {detailsModalOpen && currentUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <Users className="w-7 h-7" /> DETALLES DEL USUARIO
                </h2>
                <button onClick={() => setDetailsModalOpen(false)} className="text-gray-600 hover:text-gray-800">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="space-y-4">
                <p>
                  <strong>Nombre:</strong> {currentUser.datos?.nombre || '-'}
                </p>
                <p>
                  <strong>Apellido:</strong> {currentUser.datos?.apellido || '-'}
                </p>
                <p>
                  <strong>Email:</strong> {currentUser.datos?.email || '-'}
                </p>
                <p>
                  <strong>DNI:</strong> {currentUser.datos?.dni || '-'}
                </p>
                <p>
                  <strong>Teléfono:</strong> {currentUser.datos?.telefono || '-'}
                </p>
                <p>
                  <strong>Rol:</strong>{' '}
                  {roles.find((rol) => rol.id === currentUser.idRol)?.nombre.toUpperCase() || '-'}
                </p>
                <p>
                  <strong>Estado:</strong>{' '}
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      currentUser.estado ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {currentUser.estado ? 'ACTIVO' : 'INACTIVO'}
                  </span>
                </p>
                {currentUser.idRol === 3 && (
                  <p>
                    <strong>Especialización:</strong> {currentUser.datos?.especializacion || '-'}
                  </p>
                )}
                {currentUser.idRol === 2 && (
                  <p>
                    <strong>Área:</strong> {currentUser.datos?.area || '-'}
                  </p>
                )}
              </div>
              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => setDetailsModalOpen(false)}
                  className="bg-gray-300 text-gray-800 font-bold py-4 px-12 rounded-lg shadow-lg hover:bg-gray-400"
                >
                  CERRAR
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;