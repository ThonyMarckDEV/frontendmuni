import React, { useState, useEffect } from 'react';
import { fetchWithAuth } from '../../../../js/authToken';
import API_BASE_URL from '../../../../js/urlHelper';
import UserSearch from '../../../../components/ui/Admin/GestionUsuariosComponents/UserSearch';
import UserTable from '../../../../components/ui/Admin/GestionUsuariosComponents/UserTable';
import ActionBar from '../../../../components/ui/Admin/GestionUsuariosComponents/ActionBar';
import EditUserModal from '../../../../components/ui/Admin/GestionUsuariosComponents/EditUserModal';
import UserDetailsModal from '../../../../components/ui/Admin/GestionUsuariosComponents/UserDetailsModal';
import Pagination from '../../../../components/Reutilizables/Pagination';
import { toast } from 'react-toastify';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [areas, setAreas] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [loadingAreas, setLoadingAreas] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [paginationData, setPaginationData] = useState({
    current_page: 1,
    last_page: 1,
    links: [],
    per_page: 8,
    total: 0,
  });
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
  const [errors, setErrors] = useState({});

  const fetchUsers = async (url = `${API_BASE_URL}/api/users`) => {
    setLoading(true);
    try {
      const response = await fetchWithAuth(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const result = await response.json();
      if (result.success) {
        setUsers(result.data.data);
        setPaginationData({
          current_page: result.data.current_page,
          last_page: result.data.last_page,
          links: result.data.links,
          per_page: result.data.per_page,
          total: result.data.total,
        });
      } else {
        console.error('Error fetching users:', result.message);
        toast.error('Error fetching users: ' + result.message);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Error fetching users: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

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
          toast.error('Error fetching roles: ' + result.message);
        }
      } catch (error) {
        console.error('Error fetching roles:', error);
        toast.error('Error fetching roles: ' + error.message);
      } finally {
        setLoadingRoles(false);
      }
    };

    const fetchAreas = async () => {
      setLoadingAreas(true);
      try {
        const response = await fetchWithAuth(`${API_BASE_URL}/api/areas`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        const result = await response.json();
        if (result.success) {
          setAreas(result.data);
        } else {
          console.error('Error fetching areas:', result.message);
          toast.error('Error fetching areas: ' + result.message);
        }
      } catch (error) {
        console.error('Error fetching areas:', error);
        toast.error('Error fetching areas: ' + error.message);
      } finally {
        setLoadingAreas(false);
      }
    };

    fetchRoles();
    fetchAreas();
    fetchUsers();
  }, []);

  const handleSelectUser = (userId) => {
    const userIdStr = String(userId);
    setSelectedUsers((prev) => {
      const prevStr = prev.map((id) => String(id));
      const isSelected = prevStr.includes(userIdStr);
      return isSelected ? [] : [userId];
    });
  };

  const handlePageChange = (pageUrl) => {
    if (pageUrl) {
      fetchUsers(pageUrl);
    }
  };

  const filteredUsers = users.filter((user) => {
    if (!user.idUsuario) {
      console.warn('User with undefined idUsuario found:', user);
      return false;
    }
    const matchesSearch =
      (user.datos?.nombre || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.datos?.apellido || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.datos?.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.datos?.dni || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole ? user.idRol === parseInt(selectedRole) : true;
    return matchesSearch && matchesRole;
  });

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
      idArea: user.datos?.idArea || '',
    });
    setEditModalOpen(true);
  };

  const openDetailsModal = (user) => {
    setCurrentUser(user);
    setDetailsModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setSelectedUsers([]);
  };

  const closeDetailsModal = () => {
    setDetailsModalOpen(false);
    setSelectedUsers([]);
  };

  return (
    <div className="min-h-screen py-8 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          Gestión de Usuarios
        </h1>
        <UserSearch
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedRole={selectedRole}
          setSelectedRole={setSelectedRole}
          roles={roles}
          loadingRoles={loadingRoles}
        />
        <UserTable
          users={filteredUsers}
          roles={roles}
          loading={loading}
          selectedUsers={selectedUsers}
          handleSelectUser={handleSelectUser}
        />
        <Pagination
          paginationData={paginationData}
          onPageChange={handlePageChange}
        />
        {selectedUsers.length === 1 && (
          <ActionBar
            user={users.find((user) => user.idUsuario === selectedUsers[0])}
            openEditModal={openEditModal}
            openDetailsModal={openDetailsModal}
          />
        )}
        {editModalOpen && (
          <EditUserModal
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            setErrors={setErrors}
            roles={roles}
            areas={areas}
            loading={loading}
            loadingRoles={loadingRoles}
            loadingAreas={loadingAreas}
            handleEditSubmit={async (e) => {
              e.preventDefault();
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
                  newErrors.especializacion = 'La especialización es requerida para titulares';
                }
                if (formData.idRol === 2 && !formData.idArea) {
                  newErrors.idArea = 'El área es requerida para usuarios';
                }
                setErrors(newErrors);
                return Object.keys(newErrors).length === 0;
              };
              if (!validateForm()) return;
              setLoading(true);
              try {
                const payload = Object.fromEntries(
                  Object.entries(formData).filter(([_, value]) => value !== '' && value !== null)
                );
                const response = await fetchWithAuth(`${API_BASE_URL}/api/users/${currentUser.idUsuario}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(payload),
                });
                const result = await response.json();
                if (result.success) {
                  toast.success('Usuario actualizado exitosamente');
                  setUsers((prev) =>
                    prev.map((user) =>
                      user.idUsuario === currentUser.idUsuario
                        ? { ...user, ...result.data, datos: { ...user.datos, ...result.data.datos } }
                        : user
                    )
                  );
                  closeEditModal();
                } else {
                  setErrors(result.errors || { general: result.message });
                  toast.error(`Error: ${result.message}`);
                }
              } catch (error) {
                console.error('Error:', error.message);
                toast.error('Error al actualizar usuario');
              } finally {
                setLoading(false);
              }
            }}
            setEditModalOpen={closeEditModal}
          />
        )}
        {detailsModalOpen && currentUser && (
          <UserDetailsModal
            user={currentUser}
            roles={roles}
            areas={areas}
            setDetailsModalOpen={closeDetailsModal}
          />
        )}
      </div>
    </div>
  );
};

export default UserManagement;