import React from 'react';

const UserTable = ({ users, roles, loading, selectedUsers, handleSelectUser }) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
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
            <tr key="loading-row">
              <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                Cargando usuarios...
              </td>
            </tr>
          ) : users.length === 0 ? (
            <tr key="no-users-row">
              <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                No se encontraron usuarios
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr
                key={`user-row-${user.idUsuario}`}
                className={`hover:bg-gray-50 cursor-pointer ${
                  selectedUsers.includes(user.idUsuario) ? 'bg-blue-100' : ''
                }`}
                onClick={() => {
                  console.log(`Row clicked for user ID: ${user.idUsuario}`);
                  handleSelectUser(user.idUsuario);
                }}
              >
                <td className="px-6 py-4 whitespace-nowrap">{user.datos?.nombre || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.datos?.apellido || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.datos?.dni || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.datos?.email || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {user.rol?.nombre ? user.rol.nombre.toUpperCase() : '-'}
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
  );
};

export default UserTable;
